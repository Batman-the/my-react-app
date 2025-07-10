import React from 'react'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


import Header from './Header';

import Herosect from './Herosection'
import Card from './Card'



import Contact from './Contact'
import Footer from './Footer'






const App = () => {
  return (
    <>

     <Header/> 
     <Herosect/>
     <Card/>
    
     
     <Contact/>
    

     <Footer/>
     
    
    </>
  )
}

export default App
