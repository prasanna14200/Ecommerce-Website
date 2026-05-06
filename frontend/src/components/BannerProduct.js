import React, { useEffect, useState } from 'react'
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";


const image1 ="https://res.cloudinary.com/dtgdtj98f/image/upload/v1777813343/img1_yebm1o.webp"
const image2 ="https://res.cloudinary.com/dtgdtj98f/image/upload/v1777813421/img2_lza04z.webp"
const image3 ="https://res.cloudinary.com/dtgdtj98f/image/upload/v1777813475/img3_q0olqu.jpg"
const image4 ="https://res.cloudinary.com/dtgdtj98f/image/upload/v1777813486/img4_zabfsm.jpg"
const image5 ="https://res.cloudinary.com/dtgdtj98f/image/upload/v1777813582/img5_xultcv.webp"


const image1Mobile ="https://res.cloudinary.com/dtgdtj98f/image/upload/v1777813594/img1_mobile_utckzi.jpg"
const image2Mobile="https://res.cloudinary.com/dtgdtj98f/image/upload/v1777813606/img2_mobile_l0uurx.webp"
const image3Mobile ="https://res.cloudinary.com/dtgdtj98f/image/upload/v1777813619/img3_mobile_gqhe3z.jpg"
const image4Mobile ="https://res.cloudinary.com/dtgdtj98f/image/upload/v1777813623/img4_mobile_hoo38q.jpg"
const image5Mobile ="https://res.cloudinary.com/dtgdtj98f/image/upload/v1777813633/img5_mobile_vo68zk.png"


const BannerProduct = () => {
    const [currentImage,setCurrentImage] = useState(0)

    const desktopImages = [
        image1,
        image2,
        image3,
        image4,
        image5
    ]

    const mobileImages = [
        image1Mobile,
        image2Mobile,
        image3Mobile,
        image4Mobile,
        image5Mobile
    ]

    const nextImage = () =>{
        if(desktopImages.length - 1 > currentImage){
            setCurrentImage(preve => preve + 1)
        }
    }

    const preveImage = () =>{
        if(currentImage !== 0){
            setCurrentImage(preve => preve - 1)
        }
    }


    useEffect(()=>{
        const interval = setInterval(()=>{
            if(desktopImages.length - 1 > currentImage){
                nextImage()
            }else{
                setCurrentImage(0)
            }
        },5000)

        return ()=> clearInterval(interval)
    },[currentImage])

  return (
    <div className='container mx-auto px-4 rounded '>
        <div className='h-56 md:h-72 w-full bg-slate-200 relative'>

                <div className='absolute z-10 h-full w-full md:flex items-center hidden '>
                    <div className=' flex justify-between w-full text-2xl'>
                        <button onClick={preveImage} className='bg-white shadow-md rounded-full p-1'><FaAngleLeft/></button>
                        <button onClick={nextImage} className='bg-white shadow-md rounded-full p-1'><FaAngleRight/></button> 
                    </div>
                </div>

                {/**desktop and tablet version */}
              <div className='hidden md:flex h-full w-full overflow-hidden'>
                {
                        desktopImages.map((imageURl,index)=>{
                            return(
                            <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{transform : `translateX(-${currentImage * 100}%)`}}>
                                <img src={imageURl} className='w-full h-full'/>
                            </div>
                            )
                        })
                }
              </div>


                {/**mobile version */}
                <div className='flex h-full w-full overflow-hidden md:hidden'>
                {
                        mobileImages.map((imageURl,index)=>{
                            return(
                            <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{transform : `translateX(-${currentImage * 100}%)`}}>
                                <img src={imageURl} className='w-full h-full object-cover'/>
                            </div>
                            )
                        })
                }
              </div>


        </div>
    </div>
  )
}

export default BannerProduct
