import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCard from '../components/VerticalCard'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
     <CategoryList/>
     <BannerProduct/>

     <HorizontalCardProduct category={"airpodes"} heading={"Top airpodes"}/>
     <HorizontalCardProduct category={"speakers"} heading={"Top speakers"}/>
     <VerticalCardProduct category={"mobiles"} heading={"Top mobiles"}/> 
     <VerticalCardProduct category={"camera"} heading={"Top cameras"}/>
     <VerticalCardProduct category={"televisions"} heading={"Top televisions"}/>
     <VerticalCardProduct category={"earphones"} heading={"Top earphones"}/>
     <VerticalCardProduct category={"watches"} heading={"Top watches"}/>
     <VerticalCardProduct category={"refrigerator"} heading={"Top refridgerator"}/>
     <VerticalCardProduct category={"trimmers"} heading={"Top Trimmers"}/>
    

      
    </div>
  )
}

export default Home
