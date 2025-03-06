import React from 'react'
import {FaTwitter} from 'react-icons/fa'
import {BsFacebook, BsInstagram} from 'react-icons/bs'
import uni_img from '../../images/librarylog.png' 

import './footer.css'

const Footer = () => {
  return (
    <footer>
        <div className='social'>
            <div className="uni-logo">
              <img src={uni_img} alt="" />
            </div>
            <ul className="social-container">
              <li><FaTwitter/></li>
              <li><BsFacebook/></li>
              <li><BsInstagram/></li>
            </ul>
            
        </div>
        <div className='contact'>
          <h2>CONTACT US</h2>

        </div>
        <div className='email'>
          <h2>Feedback</h2>
        </div>
        <br />
        <p className="copy-right">
          @copy right to azasd
        </p>
    </footer>
  )
}

export default Footer
