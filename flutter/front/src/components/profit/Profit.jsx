import React from 'react'
import './profit.css'
import { FaUserGraduate } from "react-icons/fa"
import { FaUserTie } from "react-icons/fa"
import { FaRegNewspaper } from "react-icons/fa"
import { ImOffice } from "react-icons/im"
import { useTranslation } from 'react-i18next'


const Profit = () => {

    const [t] = useTranslation()


    return (
        <div className='profit'>
            <div className="intro-text" style={{ paddingTop: '0' }} >
                <h1 className='title-profit' >
                    {t('community')}
                </h1>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '400', lineHeight: '1.5', textAlign: 'center', opacity: '0.8', color: '#19355a' }}>
                    {t('community-info')}
                </h2>
            </div>
            <div className="icons-cont">
                <div className="icon-cont">
                    <FaUserGraduate className='icon' />
                    <p> {t('stu-res')} </p>
                </div>

                <div className="icon-cont">
                    <ImOffice className='icon' />
                    <p> {t('uni-inst')} </p>
                </div>
                <div className="icon-cont">
                    <FaUserTie className='icon' />
                    <p> {t('Faculty-members')} </p>
                </div>
            </div>
        </div>
    )
}

export default Profit