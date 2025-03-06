import React, { useState, useEffect} from 'react'
import {Link, useParams } from 'react-router-dom';
import Unav from '../../../components/userNav/Unav';
import payimg from '../../../images/Email campaign-amico 1.png'
import {CgSandClock} from 'react-icons/cg'
const Paymentcode = () => {
    const { id } = useParams();
    const [status, setStatus] = useState("2")
    // بص بقى ال id 
    // ده هيجيلك من بره لما يدوس على الخدمه
    // ة ال ستاتس دى هو ليها كود ولا مستنى كود دى هتستها ف يوز افيكت

    useEffect(() => {
      try{

      }catch{

      }  
      }, );

    return (
        <div>
           
            <div className="Cont-Serv">
                <img src={payimg} alt="" className='ImageService' />
                <div className="cont">
                {
                    +status === 1?
                    (
                        <div className="wait">
                           <CgSandClock/> waiting for payment code 
                        </div>
                    ):(
                        <div className="contiue">
                            <span>payment code </span>
                            <div className="code">
                                aaadd
                            </div>
                            <Link to>cotinue</Link>                       </div>
                    )
                }
                </div>
                
            </div>
        </div>
    )
}

export default Paymentcode