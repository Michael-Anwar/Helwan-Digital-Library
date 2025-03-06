import React, { useState, useEffect } from 'react'
import './contact.css'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Oval } from 'react-loading-icons'
import { useNavigate } from 'react-router-dom'
import PopupErrorMsg from '../../../components/error/PopupErrorMsg'
import PopupError from '../../../components/error/PopupError'
import { API_URL } from '../../../config'
import img from '../../../images/Email campaign-amico 1.png'



const Contact = () => {

  const [t] = useTranslation()
  const navigate = useNavigate()


  const [loading, setLoading] = useState(false)
  const [logged, setLogged] = useState(false)


  useEffect(() => {
    axios.defaults.withCredentials = true
    try {
      axios
        .get(`${API_URL}/auth/check`, { withCredentials: true })
        .then((res) => { })
        .catch((err) => {
          // console.log(err);
          setLogged(true)
          setLoading(true)

        });

    } catch (err) {
      // console.log(err)
    }
  }, [])


  const handleReturn = () => {
    navigate('/Library')
  }






  return (
    <div className="inst" style={localStorage.getItem('i18nextLng') === 'ar' ? { textAlign: 'right', direction: 'rtl' } : { textAlign: 'left', direction: 'ltr' }}>
      {logged && <PopupError message={t('err-Login')} onClose={handleReturn} />}


      {/* <h2 style={{ fontSize: '2.5rem', color: '#19355a', margin: '2rem auto' }}>
        {t('contact-head')}
      </h2> */}
      <div className="information-service_body" style={{ width: '100%' }}>
        <img src={img} alt="contact" style={{ width: '80%', height: 'auto' }} />

        {loading && logged ?
          <Oval />
          : (
            <div className="service-contact">

              <button
                className='select-service-btn'
                onClick={() => {
                  navigate('/Library/contact/send')
                }}
              >
                {t('send-msg')}
              </button>
              <button
                className='select-service-btn'
                onClick={() => {
                  navigate('/Library/contact/show')
                }}
              >
                {t('msgs')}
              </button>


            </div>
          )
        }
      </div>


    </div>
  )




}

export default Contact