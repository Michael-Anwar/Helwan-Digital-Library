import React, { useState, useEffect } from 'react'
import '../../../user/contact/contact.css'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Oval } from 'react-loading-icons'
import { useNavigate } from 'react-router-dom'
import PopupErrorMsg from '../../../../components/error/PopupErrorMsg'
import PopupError from '../../../../components/error/PopupError'
import { API_URL } from '../../../../config'
import PopupConfirm from '../../../../components/error/PopupConfirmMsg'
import { use } from 'i18next'



const SendToUser = () => {

  const [t] = useTranslation()
  const navigate = useNavigate()

  const [sendORshow, setSendORshow] = useState('send')

  const [errors, setErrors] = useState('')
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [logged, setLogged] = useState(true)
  const [confirm, setConfirm] = useState(false)
  const [filter, setFilter] = useState([])
  const [data, setData] = useState({
    message: '',
    user_id: '',
  })


  useEffect(() => {
    axios.defaults.withCredentials = true
    try {
      axios
        .get(`${API_URL}/manager/getAllUsers`, { withCredentials: true })
        .then((res) => {
          setUsers(res.data)
          setFilter(res.data)
        })
        .catch((err) => {
          console.log(err.response.status)
          if (err.response.status === 401) window.location.replace('/Library/managerlogin')
          else setErrors(t('errmsg'))
        })
    } catch (err) {
      // console.log(err)
    }
  }, [])

  const handleCloseError = () => {
    setErrors('')
  }


  const handleSend = () => {
    if (!data.message || data.message.length < 5 || data.message.trim() === '') {
      setConfirm(false)
      setErrors(t('err-msg'))
      return
    }

    axios.defaults.withCredentials = true
    try {
      console.log(data)
      axios
        .post(`${API_URL}/manager/sendMsg`, data, { withCredentials: true })
        .then((res) => {
          navigate('/Library/manager/contact')
        })
        .catch((err) => {
          if (err.response.status === 401) window.location.replace('/Library/login')
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
    <div className="inst" >
      {errors && <PopupErrorMsg message={errors} onClose={handleCloseError} />}
      {confirm && <PopupConfirm message={t('confirm-msg-contact')} onClose={() => { setConfirm(false) }} onSubmit={handleSend} />}


      <h2 style={{ fontSize: '2.5rem', color: '#19355a', margin: '2rem auto' }}>
        ارسال رسالة الي الباحث
      </h2>
      <div className="information-service_body" style={{ width: '100%' }}>

        <div className="select-input-user">
          <input type="text"
            style={{ textAlign: "center" }}
            placeholder="بحث"
            onChange={(e) => {
              const searchText = e.target.value;
              const filteredStudents = searchText === ""
                ? users
                : users.filter((item) =>
                ((item.name && item.name.includes(searchText)) ||
                  (item.national_id && item.national_id.includes(searchText)))
                );
              setFilter(filteredStudents);
            }}
          />
          <select
            className="filter"
            value={filter.length == 1 ? filter[0].user_id : data.user_id}
            onChange={(e) => {
              setData({ ...data, user_id: e.target.value })
            }
            }>
            <option value="">اختر الباحث</option>
            {filter.map((user) => (
              <option value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <h2 style={{ textAlign: 'center' }}>

          الباحث المختار : {data.user_id ? users.find((user) => user.id == data.user_id).name : ''}

        </h2>


        <textarea
          className='textAreaReson'
          placeholder='اكتب رسالتك هنا'
          onChange={(e) => {
            setData({ ...data, message: e.target.value })
          }}
        />
        <div className='btns-send-msgToUser'>
          <button
            className='select-service-btn'
            onClick={() => { setConfirm(true) }}
          >
            {t('submet')}
          </button>

          <button
            className='select-service-btn'
            style={{ backgroundColor: '#fff', color: '#19355a' }}
            onClick={() => { navigate('/Library/manager/contact') }}
          >
            {t('returnTo')}
          </button>
        </div>
      </div>


    </div>
  )




}

export default SendToUser