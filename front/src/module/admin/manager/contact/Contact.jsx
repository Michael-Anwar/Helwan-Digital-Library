import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Oval } from 'react-loading-icons'
import { useNavigate } from 'react-router-dom'
import PopupError from '../../../../components/error/PopupError'
import { API_URL } from '../../../../config'
import img from '../../../../images/Email campaign-amico 1.png'



const Contact = () => {

  const [t] = useTranslation()
  const navigate = useNavigate()


  const [loading, setLoading] = useState(false)
  const [logged, setLogged] = useState(false)


  useEffect(() => {
    
  }, [])


  const handleReturn = () => {
    navigate('/Library/managerlogin')
  }






  return (
    <div className="inst" style={{ textAlign: 'right', direction: 'rtl' }}>
      {logged && <PopupError message={t('err-Login')} onClose={handleReturn} />}


      
      <div className="information-service_body" style={{ background: '#d9d9d9' ,gap:'1rem'}}>
      <img src={img} alt="contact" style={{ width: '80%', height: 'auto' }} />

        {loading && logged ?
          <Oval />
          : (
            <>
            <div className="service-contact">

              <button
                className='select-service-btn2 select-service-btn'
                onClick={() => {
                  navigate('/Library/manager/showmsg')
                }}
              >
                الرسائل التي تم الرد عليها
              </button>
              <button
                className='select-service-btn2 select-service-btn'
                onClick={() => {
                  navigate('/Library/manager/sendmsg')
                }}
              >
                الرسائل التي لم يتم الرد عليها
              </button>
              
            </div>
            <button
                className='select-service-btn2 select-service-btn'
                onClick={() => {
                  navigate('/Library/manager/sendMsgToUser')
                }}
              >
                ارسال رسالة اللي الباحث
              </button>
            </>
          )
        }
      </div>


    </div>
  )




}

export default Contact