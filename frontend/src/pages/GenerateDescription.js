import React, { useState } from 'react'
import SummaryApi from '../common'

const GenerateDescription = () => {
  const [productName, setProductName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [features, setFeatures] = useState('')
  const [description, setDescription] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setResult('')

    const productData = {
      productName,
      brandName,
      category,
      price,
      features,
      description,
    }

    if (!productName && !description) {
      setError('Please add at least the product name or details before generating.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(SummaryApi.generateDescription.url, {
        method: SummaryApi.generateDescription.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.description)
      } else {
        setError(data.message || 'Failed to generate a description. Please try again.')
      }
    } catch (fetchError) {
      setError('Unable to reach the backend. Please check that the server is running and the backend URL is configured.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mx-auto max-w-3xl p-4'>
      <h1 className='text-2xl font-semibold mb-4'>AI Product Description Generator</h1>
      <p className='mb-4 text-slate-600'>Enter product information and generate a clean, SEO-friendly description.</p>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid gap-4 md:grid-cols-2'>
          <label className='block'>
            <span className='text-sm font-medium text-slate-700'>Product Name</span>
            <input
              type='text'
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className='mt-1 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-red-500'
              placeholder='e.g. Wireless Bluetooth Headphones'
            />
          </label>
          <label className='block'>
            <span className='text-sm font-medium text-slate-700'>Brand Name</span>
            <input
              type='text'
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className='mt-1 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-red-500'
              placeholder='Optional brand information'
            />
          </label>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <label className='block'>
            <span className='text-sm font-medium text-slate-700'>Category</span>
            <input
              type='text'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='mt-1 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-red-500'
              placeholder='e.g. Audio, Electronics'
            />
          </label>
          <label className='block'>
            <span className='text-sm font-medium text-slate-700'>Price</span>
            <input
              type='text'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className='mt-1 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-red-500'
              placeholder='e.g. ₹1,499'
            />
          </label>
        </div>

        <label className='block'>
          <span className='text-sm font-medium text-slate-700'>Key Features / Details</span>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className='mt-1 w-full min-h-[120px] rounded border border-slate-300 px-3 py-2 outline-none focus:border-red-500'
            placeholder='e.g. long battery life, fast charging, noise cancellation'
          />
        </label>

        <label className='block'>
          <span className='text-sm font-medium text-slate-700'>Description / Additional Info</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='mt-1 w-full min-h-[120px] rounded border border-slate-300 px-3 py-2 outline-none focus:border-red-500'
            placeholder='Add any product details or selling points here.'
          />
        </label>

        {error && <p className='text-sm text-red-600'>{error}</p>}

        <button
          type='submit'
          className='inline-flex items-center justify-center rounded bg-red-600 px-5 py-2 text-white hover:bg-red-700'
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Description'}
        </button>
      </form>

      {result && (
        <section className='mt-6 rounded border border-slate-200 bg-white p-4 shadow-sm'>
          <h2 className='text-xl font-semibold mb-3'>Generated Description</h2>
          <p className='whitespace-pre-line text-slate-800'>{result}</p>
        </section>
      )}
    </div>
  )
}

export default GenerateDescription
