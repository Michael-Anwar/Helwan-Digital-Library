import React from 'react'
import './coplains.css'
import QR from '../../images/qrcode.png'
import { useTranslation } from 'react-i18next'
const Coplaints = () => {

    const { t } = useTranslation()

    return (
        <div className='contnaier' style={localStorage.getItem('i18nextLng') === 'ar' ? { direction: 'rtl', textAlign: "right" } : { direction: 'ltr', textAlign: "left" }}>
            <h2>
                {t('complains.title')}
            </h2>
            <div className="flex-row">
                <p>
                    {t('complains.p')}
                </p>
                <img src={QR} alt="" className='QR' />

            </div>
            <button 
                className="c-button"
                onClick={() => window.open('https://forms.office.com/r/S3Z2zEANgM')}
            >
                    {t('click-here')}
                </button>
        </div>
    )
}

export default Coplaints