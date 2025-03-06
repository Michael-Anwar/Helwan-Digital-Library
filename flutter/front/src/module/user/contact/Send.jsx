import React, { useState, useEffect } from 'react'
import './contact.css'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Oval } from 'react-loading-icons'
import { useNavigate } from 'react-router-dom'
import PopupErrorMsg from '../../../components/error/PopupErrorMsg'
import PopupError from '../../../components/error/PopupError'
import { API_URL } from '../../../config'
import PopupConfirm from '../../../components/error/PopupConfirmMsg'



const Send = () => {

  const [t] = useTranslation()
  const navigate = useNavigate()

  const [sendORshow, setSendORshow] = useState('send')

  const [errors, setErrors] = useState('')
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedReson, setSelectedReson] = useState('')
  const [message, setMessage] = useState('')
  const [logged, setLogged] = useState(true)
  const [confirm, setConfirm] = useState(false)


  useEffect(() => {
    axios.defaults.withCredentials = true
    try {
      axios
        .get(`${API_URL}/auth/check`, { withCredentials: true })
        .then((res) => { })
        .catch((err) => {
          // console.log(err);
          setLogged(false)

        });
      axios
        .get(`${API_URL}/user/getAllServices`, { withCredentials: true })
        .then((res) => {
          setServices(res.data)
          setLoading(false)
        })
        .catch((err) => {
          if (err.response.status === 401) window.location.replace('/Library/login')
          else setErrors(t('errmsg'))
        })
    } catch (err) {
      // console.log(err)
    }
  }, [])

  const handleCloseError = () => {
    setErrors('')
  }
  const handleReturn = () => {
    navigate('/Library/login')
  }

  const handleSend = () => {
    if (!message || message.length < 5 || message.trim() === '') {
      setConfirm(false)
      setErrors(t('err-msg'))
      return
    }
    const data = {
      service_id: selectedService,
      selectedReson: selectedReson,
      message: message
    }
    axios.defaults.withCredentials = true
    try {
      console.log(data)
      axios
        .post(`${API_URL}/user/contactUs`, data, { withCredentials: true })
        .then((res) => {
          if (res.status === 200) {
            navigate('/Library')
          }
        })
        .catch((err) => {
          setConfirm(false)
          if (err.response.status === 401) window.location.replace('/Library/login')
          else if (err.response.status === 400) setErrors(err?.response?.data?.message[0] || t('errmsg'))
          else setErrors(t('errmsg'))
        })
    } catch (err) {
      // console.log(err)
      setErrors(t('errmsg'))
    }
  }

  const getTranslatedServiceName = (service) => {
    const currentLanguage = localStorage.getItem("i18nextLng");
    if (service.id == 9) {
      return t('code_complaint')
    } else {
      return currentLanguage == "en" ? service.service_name : service.service_name_ar;
    }
  };


  return (
    <div className="inst" style={localStorage.getItem('i18nextLng') === 'ar' ? { textAlign: 'right', direction: 'rtl' } : { textAlign: 'left', direction: 'ltr' }}>
      {errors && <PopupErrorMsg message={errors} onClose={handleCloseError} />}
      {!logged && <PopupError message={t('err-Login')} onClose={handleReturn} />}
      {confirm && <PopupConfirm message={t('confirm-msg-contact')} onClose={() => { setConfirm(false) }} onSubmit={handleSend} />}

      {!selectedService && !selectedReson ? (
        <>
          <h2 style={{ fontSize: '2.5rem', color: '#19355a', margin: '2rem auto' }}>
            {t('contact-head')}
          </h2>
          <div className="information-service_body" >
            {loading || !logged ?
              <Oval />
              : (
                <div className="two service-contact ">
                  {services.length > 0 && services.map((service) => (
                    <button
                      className='select-service-btn'
                      onClick={() => {
                        setSelectedService(service.id)
                      }}
                    >
                      {getTranslatedServiceName(service)}
                    </button>

                  ))}
                </div>
              )
            }
            <button
              className='select-service-btn'
              style={{ backgroundColor: '#fff', color: '#19355a' }}
              onClick={() => {
                navigate('/Library/contact')
              }}
            >
              {t('returnTo')}
            </button>
          </div>
        </>
      ) : selectedService && !selectedReson ? (
        <>
          <h2 style={{ fontSize: '2.5rem', color: '#19355a', margin: '2rem auto' }}>
            {t('choose-reson')}
          </h2>
          <div className="information-service_body" style={{ width: '100%' }}>

            <h2 style={{ textAlign: 'center' }}>
              {t('choosed-service')} : {services
                .filter((service) => service.id === selectedService)
                .map((service1) => (getTranslatedServiceName(service1)))}
            </h2>
            <div className="service-contact">
              <button
                className='select-service-btn'
                onClick={() => {
                  setSelectedReson('1')
                }}
              >
                {t('reson1')}
              </button>
              <button
                className='select-service-btn'
                onClick={() => {
                  setSelectedReson('2')
                }}
              >
                {t('reson2')}
              </button>
            </div>
            {selectedReson && selectedService ? (
              <textarea
                className='textAreaReson'
                placeholder={t('write-message')}
              // style={{ width: '80%', height: '200px', margin: '2rem auto' }}
              />
            ) : null}
            <button
              className='select-service-btn'
              style={{ backgroundColor: '#fff', color: '#19355a' }}
              onClick={() => {
                setSelectedService('')
              }}
            >
              {t('returnTo')}
            </button>
          </div>
        </>
      ) :
        selectedService && selectedReson ? (
          <>
            <h2 style={{ fontSize: '2.5rem', color: '#19355a', margin: '2rem auto' }}>
              {t('choose-reson')}
            </h2>
            <div className="information-service_body" style={{ width: '100%' }}>

              <h2 style={{ textAlign: 'center' }}>
                {t('choosed-service')} : {services
                  .filter((service) => service.id === selectedService)
                  .map((service1) => (getTranslatedServiceName(service1)))}
                {/* {t('choosed-service')} : {services.filter((service) => service.id === selectedService)[0].service_name_ar} */}
              </h2>
              <h2 style={{ textAlign: 'center' }}>
                {t('choosed-reson')} : {selectedReson === '1' ? t('reson1') : t('reson2')}
              </h2>

              <div className="service-contact">
                <button
                  className='select-service-btn'
                  onClick={() => {
                    setSelectedReson('1')
                  }}
                >
                  {t('reson1')}
                </button>
                <button
                  className='select-service-btn'
                  onClick={() => {
                    setSelectedReson('2')
                  }}
                >
                  {t('reson2')}
                </button>
              </div>
              {selectedReson && selectedService ? (
                <>
                  <textarea
                    className='textAreaReson'
                    placeholder='اكتب رسالتك هنا'
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    className='select-service-btn'
                    onClick={() => { setConfirm(true) }}
                  >
                    {t('submet')}
                  </button>

                </>
              ) : null}
              <button
                className='select-service-btn'
                style={{ backgroundColor: '#fff', color: '#19355a' }}
                onClick={() => {
                  setSelectedService('')
                  setSelectedReson('')
                }}
              >
                {t('returnTo')}
              </button>
            </div>
          </>
        ) : null}

    </div>
  )




}

export default Send