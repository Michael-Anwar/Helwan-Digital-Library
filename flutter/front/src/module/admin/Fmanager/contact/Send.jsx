import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Oval } from 'react-loading-icons'
import { useNavigate } from 'react-router-dom'
import PopupError from '../../../../components/error/PopupErrorMsg'
import { API_URL } from '../../../../config'
import PopupConfirmMsg from '../../../../components/error/PopupConfirmMsg'

const Send = () => {

    const [t] = useTranslation()
    const navigate = useNavigate()


    const [loading, setLoading] = useState(true)
    const [logged, setLogged] = useState(true)

    const [errors, setErrors] = useState('')
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])
    const [response, setResponse] = useState('')
    const [confirm, setConfirm] = useState(false)
    const [messageSelected, setMessageSelected] = useState([])
    const [filter, setFilter] = useState([])


    useEffect(() => {
        axios.defaults.withCredentials = true
        try {
            axios.get(`${API_URL}/manager/getusermessagesToShow`, { withCredentials: true })
                .then((res) => {
                    setData(res.data)
                    setLoading(false)
                    setFilter(res.data)
                })
                .catch((err) => {
                    if (err.response.status === 401) window.location.replace('/Library/login')
                    // else setErrors(t('errmsg'))
                    setLoading(false)
                })

            axios.get(`${API_URL}/manager/getallMessagesForManager`, { withCredentials: true })
                .then((res) => {
                    setData2(res.data)
                    setLoading(false)
                })
                .catch((err) => {
                    if (err.response.status === 401) window.location.replace('/Library/managerlogin')
                    // else setErrors(t('errmsg'))
                    setLoading(false)
                })



        } catch (err) {
            // console.log(err)
        }
    }, [])


    const handleReturn = () => {
        navigate('/Library/managerlogin')
    }
    const handleCloseError = () => {
        setErrors('')
        setConfirm(false)
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

    const hanleSend = () => {
        setConfirm(false)
        if (response === '' || response.trim() === '' || response.length < 5) {
            setErrors("يجب ان يكون الرد اكثر من 5 حروف")
            setConfirm(false)
            return
        }

        console.log(messageSelected)
        const responsesend = {
            response: response,
            message_id: messageSelected.id
        }

        axios.defaults.withCredentials = true
        try {
            axios
                .put(`${API_URL}/manager/sendresponse`, responsesend, { withCredentials: true })
                .then(() => {
                    setConfirm(false)
                    setResponse('')
                    navigate('/Library/manager/contact')
                })
                .catch((err) => {
                    if (err.response.status === 401) navigate('/Library/login')
                    else setErrors(t('errmsg'))
                })
        } catch (err) {
            // console.log(err)
        }
    }




    return (
        <div className="inst" style={{ display: "block", direction: 'rtl', textAlign: 'center' }}>
            {!logged && <PopupError message={t('err-Login')} onClose={handleReturn} />}
            {confirm && <PopupConfirmMsg message={t('confirm-msg-contact')} onClose={handleCloseError} onSubmit={hanleSend} />}
            {errors && <PopupError message={errors} onClose={handleCloseError} />}


            <h2 style={{ fontSize: '2.5rem', color: '#19355a', margin: '2rem auto' }}>
                {t('msg-replay')}
            </h2>
            <div className="information-service_body" >
                <select
                    className="filter"
                    onChange={(e) => {
                        if (e.target.value === "1") {
                            setFilter(data)
                        } else {
                            setFilter(data2)
                        }
                    }}
                >
                    <option value="1">الرسائل المرسلة من الباحثين</option>
                    <option value="2">الرسائل المرسلة من المكتبه</option>
                </select>
                {loading && logged ?
                    <Oval />
                    : (
                        <div className="contact-msg" style={localStorage.getItem('i18nextLng') === 'ar' ? { textAlign: 'right', direction: 'rtl', width: '100%' } : { textAlign: 'left', direction: 'ltr', width: '100%' }}>

                            {filter.length > 0 && filter.filter((item) => item.response == null)
                                .map((item, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            {/* <div className="contact-msg-head" style={{ textAlign: 'center' }}>
                                                <h3>{item.service_name_ar}</h3>
                                            </div> */}
                                            <div className="contact-msg-body">
                                                <h2>- {item.message}</h2>
                                                <div className='contact-msg-body-date'>
                                                    {item.reson == 0 ? (
                                                        <p>
                                                            من  {item.mname}  الي  {item.name}
                                                        </p>
                                                    ) : (
                                                        <p >
                                                            {item.name}
                                                        </p>
                                                    )}
                                                    <p >
                                                        {format(item.reson_date)}
                                                    </p>

                                                </div>
                                            </div>
                                            {item.reson == 0 ? (
                                                <React.Fragment>
                                                    <div className="contact-msg-body">
                                                        <h2 style={{ color: '#ad8700' }}>
                                                            ={'>'} لم يتم الرد عليها بعد
                                                        </h2>
                                                    </div>
                                                    {/* <hr /> */}
                                                </React.Fragment>
                                            ) : (
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
                                                            onClick={() => {
                                                                setConfirm(true)
                                                                setMessageSelected(item)
                                                            }}
                                                        >
                                                            ارسال
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                            <hr />

                                        </React.Fragment>
                                    );
                                })}


                        </div>
                    )
                }
                {filter.filter((item) => item.response == null).length === 0 && (
                    <div className="contact-msg" style={{ textAlign: 'center' }}>
                        <h3>{t('no-msg')}</h3>
                    </div>
                )}
                <button
                    className='select-service-btn'
                    style={{ backgroundColor: '#fff', color: '#19355a' }}
                    onClick={() => {
                        navigate('/Library/manager/contact')
                    }}
                >
                    {t('returnTo')}
                </button>
            </div>


        </div>
    )




}

export default Send