import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BsChatDots } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { MdSend } from 'react-icons/md';
import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';

const starterMessage = {
  role: 'assistant',
  text: 'Hi! I can help with product details, prices, availability, order tracking, shipping, returns, refunds, cancellations, and payment questions.',
};

const quickQuestions = [
  'Product price',
  'Order status',
  'Return help',
  'Payment issue',
];

const orderWords = ['order', 'tracking', 'track', 'delivery status', 'where is my order'];
const shippingWords = ['shipping', 'delivery', 'deliver', 'timeline', 'when will'];
const returnWords = ['return', 'refund', 'cancel', 'cancellation', 'replace'];
const paymentWords = ['payment', 'billing', 'paid', 'card', 'upi', 'transaction'];
const stockWords = ['stock', 'available', 'availability', 'waterproof', 'warranty', 'specification', 'feature'];

const normalizeText = (text) => text.toLowerCase().trim();

const findProduct = (products, query) => {
  const normalizedQuery = normalizeText(query);

  return products.find((product) => {
    const searchableText = [
      product?.productName,
      product?.brandName,
      product?.category,
      product?.description,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return product?.productName && normalizedQuery.includes(product.productName.toLowerCase())
      ? true
      : searchableText.split(/\s+/).some((word) => word.length > 3 && normalizedQuery.includes(word));
  });
};

const hasAnyWord = (query, words) => words.some((word) => query.includes(word));

const productAnswer = (product, query) => {
  const parts = [];

  parts.push(`${product.productName} is listed in ${product.category || 'the store'}.`);

  if (product.brandName) {
    parts.push(`Brand: ${product.brandName}.`);
  }

  if (product.sellingPrice) {
    parts.push(`Current price: ${displayINRCurrency(product.sellingPrice)}.`);
  }

  if (product.price && product.price !== product.sellingPrice) {
    parts.push(`Original price: ${displayINRCurrency(product.price)}.`);
  }

  if (product.description) {
    parts.push(`Details: ${product.description}`);
  }

  if (hasAnyWord(normalizeText(query), stockWords)) {
    parts.push('Stock, warranty, waterproof rating, and other exact specifications are not available in the product data I have here.');
  }

  return parts.join(' ');
};

const buildAssistantReply = (query, products) => {
  const normalizedQuery = normalizeText(query);
  const product = findProduct(products, query);

  if (!normalizedQuery) {
    return 'Please type your question, and I will help you with shopping, products, orders, delivery, returns, or payments.';
  }

  if (product || normalizedQuery.includes('product') || normalizedQuery.includes('price')) {
    if (product) {
      return productAnswer(product, query);
    }

    return 'Which product are you asking about? Please share the product name so I can check the available details.';
  }

  if (hasAnyWord(normalizedQuery, orderWords)) {
    return 'Please share your order ID. I do not have order tracking details yet, so I need the order ID or tracking number to help accurately.';
  }

  if (hasAnyWord(normalizedQuery, shippingWords)) {
    return 'Please share the product name or order ID. Delivery timelines depend on the product and shipping details, and I do not want to guess.';
  }

  if (hasAnyWord(normalizedQuery, returnWords)) {
    return 'I can help with returns, refunds, or cancellations. Please share your order ID and the issue with the product. If the store policy is not shown, customer support can confirm the next step.';
  }

  if (hasAnyWord(normalizedQuery, paymentWords)) {
    return 'For payment or billing issues, please share your order ID and payment status. Do not share full card details or sensitive banking information here.';
  }

  if (normalizedQuery.includes('support') || normalizedQuery.includes('help')) {
    return 'Sure, I can help. Please tell me if this is about a product, order, delivery, return, refund, cancellation, or payment.';
  }

  return 'I am here to help with shopping-related questions like products, orders, delivery, returns, refunds, cancellations, and payments. Please ask about one of those topics.';
};

const CustomerSupportAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([starterMessage]);
  const messagesEndRef = useRef(null);

  const productCountText = useMemo(() => {
    if (!products.length) {
      return 'Product data loading';
    }

    return `${products.length} products available`;
  }, [products.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(SummaryApi.allProduct.url);
        const data = await response.json();

        if (data?.success && Array.isArray(data?.data)) {
          setProducts(data.data);
        }
      } catch (error) {
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (messageText = input) => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      { role: 'user', text: trimmedMessage },
    ]);
    setInput('');

    try {
      const response = await fetch(SummaryApi.chat.url, {
        method: SummaryApi.chat.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: trimmedMessage }),
      });
      const data = await response.json();

      if (data?.success && data?.answer) {
        setMessages((previousMessages) => [
          ...previousMessages,
          { role: 'assistant', text: data.answer },
        ]);
        return;
      }
    } catch (error) {
      // fallback to local assistant if backend is unavailable
    }

    const reply = buildAssistantReply(trimmedMessage, products);

    setMessages((previousMessages) => [
      ...previousMessages,
      { role: 'assistant', text: reply },
    ]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage();
  };

  return (
    <div className='fixed bottom-5 right-4 z-[9999]'>
      {isOpen && (
        <section className='mb-3 w-[calc(100vw-32px)] max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl'>
          <div className='flex items-center justify-between bg-red-600 px-4 py-3 text-white'>
            <div>
              <h2 className='text-base font-semibold'>Customer Support</h2>
              <p className='text-xs text-red-50'>{productCountText}</p>
            </div>
            <button
              type='button'
              className='flex h-8 w-8 items-center justify-center rounded-full hover:bg-red-700'
              onClick={() => setIsOpen(false)}
              aria-label='Close customer support assistant'
            >
              <IoClose className='text-xl' />
            </button>
          </div>

          <div className='h-80 space-y-3 overflow-y-auto bg-slate-50 px-4 py-3'>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-red-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className='flex gap-2 border-t border-slate-200 bg-white px-3 py-2'>
            {quickQuestions.map((question) => (
              <button
                key={question}
                type='button'
                className='rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:border-red-500 hover:text-red-600'
                onClick={() => sendMessage(question)}
              >
                {question}
              </button>
            ))}
          </div>

          <form className='flex items-center gap-2 border-t border-slate-200 p-3' onSubmit={handleSubmit}>
            <input
              type='text'
              className='min-w-0 flex-1 rounded-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500'
              placeholder='Ask about products or orders...'
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button
              type='submit'
              className='flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700'
              aria-label='Send message'
            >
              <MdSend className='text-lg' />
            </button>
          </form>
        </section>
      )}

      <button
        type='button'
        className='ml-auto flex h-14 items-center gap-2 rounded-full bg-red-600 px-5 text-white shadow-xl hover:bg-red-700'
        onClick={() => setIsOpen((previousValue) => !previousValue)}
        aria-label='Open customer support assistant'
      >
        <BsChatDots className='text-2xl' />
        <span className='text-sm font-semibold'>Support</span>
      </button>
    </div>
  );
};

export default CustomerSupportAssistant;
