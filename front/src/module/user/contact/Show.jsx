import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Oval } from 'react-loading-icons'
import { useNavigate } from 'react-router-dom'
import PopupErrorMsg from '../../../components/error/PopupErrorMsg'
import PopupError from '../../../components/error/PopupError'
import { API_URL } from '../../../config'
import PopupConfirm from '../../../components/error/PopupConfirmMsg'




const Show = () => {

    const [t] = useTranslation()
    const navigate = useNavigate()


    const [loading, setLoading] = useState(false)
    const [logged, setLogged] = useState(true)
    const [filter, setFilter] = useState([])
    const [errors, setErrors] = useState('')
    const [data, setData] = useState([])
    const [response, setResponse] = useState('')
    const [confirm, setConfirm] = useState(false)
    const [messageSelected, setMessageSelected] = useState([])
    const [dataResponse, setDataResponse] = useState({
        response: '',
        message_id: '',
    })



    useEffect(() => {
        axios.defaults.withCredentials = true
        try {
            axios
                .get(`${API_URL}/auth/check`, { withCredentials: true })
                .then((res) => {
                    setLogged(true)
                })
                .catch((err) => {
                    // console.log(err);
                    setLogged(false)

                });

            axios
                .get(`${API_URL}/user/getusermessages`, { withCredentials: true })
                .then((res) => {
                    setData(res.data)
                    setLoading(true)
                    setFilter(Array.isArray(res.data) ? res.data.filter((item) => item.reson != 0) : null);
                })
                .catch((err) => {
                    if (err.response.status === 401) window.location.replace('/Library/login')
                    // else setErrors(t('errmsg'))
                    setLoading(false)
                })



        } catch (err) {
            // console.log(err)
        }
    }, [])


    const handleReturn = () => {
        navigate('/Library/login')
    }



    const format = (date) => {
        const formattedDate = new Date(date).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        // Extract components from formattedDate
        const [, day, month, year, time] = /(\d+)\/(\d+)\/(\d+), (.+)/.exec(formattedDate);

        // Convert time to 12-hour format with AM/PM
        const [hour, minute, second] = time.split(':');
        const amPm = hour >= 12 ? 'مساءً' : 'صباحا';
        const formattedTime = `${(hour % 12) || 12}:${minute}:${second} ${amPm}`;

        // Combine components to create the final formatted date
        const formattedDateTime = `${day}/${month}/${year}, ${formattedTime}`;

        return formattedDateTime;
    };

    const getTranslatedServiceName = (service) => {
        const currentLanguage = localStorage.getItem("i18nextLng");
        if (service.id == 9) {
            return t('code_complaint')
        } else {
            return currentLanguage == "en" ? service.service_name : service.service_name_ar;
        }
    };

    const handleSend = () => {
        console.log(dataResponse)
        if (!dataResponse.response || dataResponse.response.length < 5 || dataResponse.response.trim() === '') {
            setConfirm(false)
            setErrors(t('err-msg'))
            return
        }
        axios.defaults.withCredentials = true
        try {
            axios
                .post(`${API_URL}/user/sendResponse`, dataResponse, { withCredentials: true })
                .then((res) => {
                    navigate('/Library/contact')
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

    const handleClose = () => {
        setErrors('')
        setConfirm(false)
    }



    return (
        <div className="inst" style={localStorage.getItem('i18nextLng') === 'ar' ? { textAlign: 'right', direction: 'rtl' } : { textAlign: 'left', direction: 'ltr' }}>
            {!logged && <PopupError message={t('err-Login')} onClose={handleReturn} />}
            {confirm && <PopupConfirm message={t('confirm-msg-contact')} onClose={handleClose} onSubmit={handleSend} />}
            {errors && <PopupErrorMsg message={errors} onClose={handleClose} />}
            <h2 style={{ fontSize: '2.5rem', color: '#19355a', margin: '2rem auto' }}>
                {t('msg-replay')}
            </h2>
            <div className="information-service_body" style={{ gap: '1rem' }}>
                <select
                    style={{ width: 'auto' }}
                    className="filter"
                    onChange={(e) => {
                        if (e.target.value == 1) {
                            setFilter(data.filter((item) => item.reson != 0))
                        } else if (e.target.value == 2) {
                            setFilter(data.filter((item) => item.reson == 0))
                        } else {
                            setFilter(data.filter((item) => item.reson != 0))
                        }
                    }}
                >
                    <option value="1">الرسائل المرسلة منك</option>
                    <option value="2">الرسائل المرسلة اليك</option>
                </select>
                {!loading && !logged ?
                    <Oval />
                    : (
                        <div className="contact-msg" style={localStorage.getItem('i18nextLng') === 'ar' ? { textAlign: 'right', direction: 'rtl', width: '100%' } : { textAlign: 'left', direction: 'ltr', width: '100%' }}>

                            {filter.length > 0 && filter.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <div className="contact-msg-head" style={{ textAlign: 'center', marginTop: '1rem' }}>
                                            <h3>{getTranslatedServiceName(item)}</h3>
                                            <h3 style={{ color: "#ad8700" }}>{item.reson == 1 ? t('reson1') : item.reson == 2 ? t('reson2') : null}</h3>
                                        </div>
                                        <hr />
                                        <div className="contact-msg-body">
                                            <h2>- {item.message}</h2>
                                            <div className='contact-msg-body-date'>
                                                {item.reson == 0 ? (
                                                    <p >
                                                        {t('responsible-for')} {getTranslatedServiceName(item)}
                                                    </p>
                                                ) : (
                                                    <p >

                                                    </p>
                                                )}
                                                <p >
                                                    {format(item.reson_date)}
                                                </p>

                                            </div>
                                        </div>
                                        {item.response ? (
                                            <React.Fragment>
                                                <div className="contact-msg-body">
                                                    <h2 style={{ color: '#ad8700' }}>
                                                        ={'>'} {item.response}
                                                    </h2>
                                                    <p style={localStorage.getItem('i18nextLng') === 'ar' ? { textAlign: 'left', direction: 'ltr' } : { textAlign: 'right', direction: 'rtl' }}>
                                                        {format(item.response_date)}
                                                    </p>
                                                </div>
                                                {/* <hr /> */}
                                            </React.Fragment>
                                        ) : item.response == null && item.reson == 0 ? (
                                            <>
                                                <div className="contact-msg-body">
                                                    <textarea
                                                        className='textAreaResponse'
                                                        placeholder='اكتب ردك هنا ...'
                                                        onChange={(e) => {
                                                            setResponse(e.target.value)
                                                        }}
                                                    />
                                                    <button
                                                        className="select-service-btn"
                                                        onClick={(e) => {
                                                            setDataResponse({
                                                                ...dataResponse,
                                                                user_id: item.user_id,
                                                                message_id: item.message_id,
                                                                response: response
                                                            })
                                                            setConfirm(true)

                                                        }}
                                                    >
                                                        ارسال
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <h2 style={{ color: '#ad8700' }}>
                                                {t('msg-not-replay')}
                                            </h2>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            {filter.length == 0 && (
                                <div className="contact-msg" style={{ textAlign: 'center' }}>
                                    <h3>{t('no-msg')}</h3>
                                </div>
                            )}


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


        </div>
    )




}

export default Show