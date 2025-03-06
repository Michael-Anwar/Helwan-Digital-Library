import React from 'react'
import './about.css'
import Coplaints from '../../../components/complains/Coplaints'
import { useTranslation } from 'react-i18next'

const About = () => {

  const { t } = useTranslation()


  return (
    <div className='about' id='services' >
      <div className='intro-text'>
        <h2 style={{ fontSize: '2.5rem' ,margin: 'auto' }}>
          {t('aboutus.title')}
        </h2>
        <h2 style={{ fontSize: '1.8rem',margin: 'auto' }}>
          {t('aboutus.h3')}
        </h2>
        <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "400",
            lineHeight: "1.5",
            textAlign: "center",
            opacity: "0.8",
            margin: 'auto auto 1rem auto'
          }}>
          {/* {t('aboutus.p')} */}
        </h2>
      </div>
      <section className='grid-3'>
        <div className="about-cont"
          style={localStorage.getItem('i18nextLng') === 'ar' ? { direction: 'rtl', textAlign: "right" } : { direction: 'ltr', textAlign: "left" }}
        >
          <span></span>
          <h1>{t('aboutus.us')}</h1>
          <p>{t('aboutus.us-p')}</p>
        </div>
        <div className="about-cont"
          style={localStorage.getItem('i18nextLng') === 'ar' ? { direction: 'rtl', textAlign: "right" } : { direction: 'ltr', textAlign: "left" }}
        >
          <span></span>
          <h1>{t('aboutus.our-vision')}</h1>
          <p>
            <span>{t('aboutus.our-message')} : </span>
          </p>
          <ol>
            <li>
              {t('aboutus.our-vision-p1')}
            </li>
            <li>
              {t('aboutus.our-vision-p2')}
            </li>
            <li>
              {t('aboutus.our-vision-p3')}
            </li>
            <li>
              {t('aboutus.our-vision-p4')}
            </li>
          </ol>
        </div>
        <div className="about-cont"
          style={localStorage.getItem('i18nextLng') === 'ar' ? { direction: 'rtl', textAlign: "right" } : { direction: 'ltr', textAlign: "left" }}
        >
          <span></span>
          <h1>{t('aboutus.our-goals')}</h1>
          <ol>
            <li>
              {t('aboutus.our-goals-1')}
            </li>
            <li>
              {t('aboutus.our-goals-2')}
            </li>
            <li>
              {t('aboutus.our-goals-3')}
            </li>
            <li>
              {t('aboutus.our-goals-4')}
            </li>
            <li>
              {t('aboutus.our-goals-5')}
            </li>
            <li>
              {t('aboutus.our-goals-6')}
            </li>
            <li>
              {t('aboutus.our-goals-7')}
            </li>
            <li>
              {t('aboutus.our-goals-8')}
            </li>
            <li>
              {t('aboutus.our-goals-9')}
            </li>
          </ol>
        </div>
      </section>
      <Coplaints />

    </div>
  )
}

export default About