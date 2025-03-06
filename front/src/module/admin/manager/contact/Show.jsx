import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Oval } from 'react-loading-icons'
import { useNavigate } from 'react-router-dom'
import PopupError from '../../../../components/error/PopupError'
import { API_URL } from '../../../../config'
import ReactPaginate from 'react-paginate';


const Show = () => {

    const [t] = useTranslation()
    const navigate = useNavigate()


    const [loading, setLoading] = useState(true)
    const [logged, setLogged] = useState(true)
    const [errors, setErrors] = useState('')
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [applicantsPerPage] = useState(localStorage.getItem('applicantsPerPage') || 5)
    const [totalPages, setTotalPages] = useState(1)
    const [totalApplicants, setTotalApplicants] = useState(0)



    useEffect(() => {
        axios.defaults.withCredentials = true
        try {
            axios
                .get(`${API_URL}/manager/getusermessages`, {
                    params: {
                        page: currentPage,
                        limit: applicantsPerPage,
                        response: 'notNull'
                    },
                    withCredentials: true
                }).then((res) => {
                    setData(res.data.result || [] ? res.data.result.length > 0 ? res.data.result.map((item) => { return { ...item, response: item.response ? item.response : null } }) : [] : [])
                    setTotalPages(res.data.pages)
                    setTotalApplicants(res.data.total)
                    setLoading(false)
                })
                .catch((err) => {
                    if (err.response.status === 401) window.location.replace('/Library/managerlogin')
                    else setErrors(t('errmsg'))
                    setLoading(false)
                })
        } catch (err) {
            // console.log(err)
        }
    }, [currentPage, applicantsPerPage])


    const handleReturn = () => {
        navigate('/Library/managerlogin')
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



    return (
        <div className="inst" style={{ display: "block", direction: 'rtl', textAlign: 'center', paddingBottom: '2rem' }}>
            {!logged && <PopupError message={t('err-Login')} onClose={handleReturn} />}


            <h2 style={{ fontSize: '2.5rem', color: '#19355a', margin: '2rem auto', textAlign: 'center' }}>
                {t('msg-replay')}
            </h2>
            <div className="information-service_body" >
                {loading && logged ?
                    <Oval />
                    : (
                        <div className="contact-msg" style={localStorage.getItem('i18nextLng') === 'ar' ? { textAlign: 'right', direction: 'rtl', width: '100%' } : { textAlign: 'left', direction: 'ltr', width: '100%' }}>

                            {data.length > 0 && data.map((item, index) => {
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
                                        {item.response && (
                                            <React.Fragment>
                                                <div className="contact-msg-body">
                                                    <h2 style={{ color: '#ad8700' }}>
                                                        ={'>'} {item.response}
                                                    </h2>
                                                    <div className='contact-msg-body-date'>
                                                        {item.reson == 0 ? (
                                                            <p>
                                                                {item.name}
                                                            </p>
                                                        ) : (
                                                            <p>
                                                                {item.mname}
                                                            </p>
                                                        )}
                                                        <p >
                                                            {format(item.response_date)}
                                                        </p>

                                                    </div>
                                                </div>
                                                {/* <hr /> */}
                                            </React.Fragment>
                                        )}
                                        <hr />

                                    </React.Fragment>

                                );
                            })}


                        </div>
                    )
                }
                {data.length === 0 && (
                    <div className="contact-msg" style={{ textAlign: 'center' }}>
                        <h3>{t('no-msg')}</h3>
                    </div>
                )}
                {/* <button
                    className='select-service-btn'
                    style={{ backgroundColor: '#fff', color: '#19355a' }}
                    onClick={() => {
                        navigate('/Library/manager/contact')
                    }}
                >
                    {t('returnTo')}
                </button> */}
            </div>

            {data.length > 0 && (
                <>
                    <div style={{ margin: '2rem auto', textAlign: 'center' }}>
                        <ReactPaginate
                            previousLabel={'السابق'}
                            nextLabel={'التالي'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={(e) => setCurrentPage(e.selected + 1)}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}

                        />
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem", gap: "1rem" }}>
                            <span style={{ fontSize: "1.2rem" }}>عدد الطلبات : {totalApplicants}</span>
                        </div>
                    </div>

                </>
            )}


        </div>
    )




}

export default Show