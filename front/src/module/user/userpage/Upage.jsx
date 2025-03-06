import React from 'react'
import Unav from '../../../components/userNav/Unav'
import { Outlet } from 'react-router-dom';
import './upage.css'
import { useEffect } from 'react';
import Footer from '../../../components/footer/Footer';

const Upage = () => {

  // useEffect(() => {
  //   try {
  //     if (!localStorage.getItem('token')) {

  //     }
  //   } catch (err) {
  //     // console.log(err)
  //   }
  // }, [])
  return (
    <div className='pageContainer'>
      <Unav />
      <div className="out">
        <Outlet />
        {/* <Footer /> */}
      </div>
    </div>
  )
}

export default Upage