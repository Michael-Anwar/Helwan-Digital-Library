import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Unav from "../../../components/userNav/Unav";
import PopupError from "../../../components/error/PopupError";
import { useTranslation } from "react-i18next";
import axios from "axios";

import "./inst.css";
import { t } from "i18next";
import { API_URL } from "../../../config";

const Instructons = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logged, setLogged] = useState("");
  const [errors2, setErrors2] = useState("");
  const { t } = useTranslation();
  const [service, setService] = useState({});

  useEffect(() => {
    try {
      axios.defaults.withCredentials = true;
      axios
        .get(`${API_URL}/auth/check`, { withCredentials: true })
        .then((res) => {
          setLogged(true);
        })
        .catch((err) => {
          // console.log(err);
          setLogged(false);
        });
    } catch (err) {
      // console.log(err);
      setLogged(false);
    }

    axios.get(`${API_URL}/manager/getOneService/${id}`, { withCredentials: true })
    .then((res) => {
      setService(res.data);
    }).catch((err) => {
      // console.log(err);
    }
    );

  }, []);

  const handleNext = () => {
    if (logged) {
      navigate(`/Library/service/${id}`);
    } else {
      setErrors2(t("err-Login"));
    }
  };
  const handleCloseError = () => {
    setErrors2("");
  };
console.log(service)
  return (
    <div className="inst" style={{ backgroundColor: "#fff" }}>
      {errors2 && <PopupError message={errors2} onClose={handleCloseError} />}

      <div
        className="inst-container"
        style={
          localStorage.getItem("i18nextLng") == "ar"
            ? { direction: "rtl" }
            : { direction: "ltr" }
        }
      >
        <img src="../assets/librarylog.jpg" alt="" />
        <div className="information-service_body">
          {/* <h1>{t(`service${id}-name`)}</h1> */}
          <h1>{localStorage.getItem("i18nextLng") == "ar" ? service.service_name_ar : service.service_name}</h1>
          <hr style={{ width: "60%" }} />
          <h2
            style={
              localStorage.getItem("i18nextLng") == "ar"
                ? { textAlign: "right", width: "100%", color: "#ad8700" }
                : { textAlign: "left", width: "100%", color: "#ad8700" }
            }
          >
            {t("service-steps")}
          </h2>
          <ul
            className="list-steps"
            style={
              localStorage.getItem("i18nextLng") == "ar"
                ? { direction: "rtl", width: "100%" }
                : { direction: "ltr", width: "100%" }
            }
          >
            {id == 1 || id == 2 || id == 3 || id == 4 || id == 5 || id == 6 ? (
              <>
                {id != 3 && (
                  <li>
                    1- {t(`service${id}-step1`)}
                    {id == 5 && (
                      <Link
                        to="https://sso.scu.eg/"
                        style={{
                          color: "#ad8700",
                          textDecoration: "underline",
                          fontWeight: "bolder",
                        }}
                      >
                        {" "}
                        https://sso.scu.eg
                      </Link>
                    )}
                  </li>
                )}

                {id == 5 ? (
                  <>
                    <li>2- {t("service5-step2")}</li>
                    <li style={{ color: "#ad8700" }}>
                      ********{t("service5-step4")}********
                    </li>

                    <li>3- {t("service3-step1")}</li>
                    <li>4- {t(`service${id}-step-two.files_numbers`)}</li>
                  </>
                ) : null}
                {id == 3 && <li>1- {t("service3-step2")}</li>}
                {id == 1 || id == 2 || id == 7 || id == 8 ? (
                  <li>2- {t("service1-step2")}</li>
                ) : null}
                {id == 5 ? (
                  <p>*** {t("service5-step0")} ***</p>
                ) : (
                  <p>*** {t("service1-step3")} ***</p>
                )}
              </>
            ) : null}
            {id == 1 ? (
              <>
                <li>3- {t("service1-step4")}</li>
                <li>4- {t("service1-step5")}</li>
                <li>5- {t("service1-step6")}</li>
              </>
            ) : id == 2 ? (
              <>
                <li>3- {t("service1-step4")}</li>
                <li>4- {t("service2-step5")}</li>
                <li>5- {t("service2-step6")}</li>
              </>
            ) : id == 3 ? (
              <>
                <li>2- {t("service1-step4")}</li>
                <li>3- {t("service3-step5")}</li>
                <li>4- {t("service3-step4")}</li>
              </>
            ) : id == 4 ? (
              <>
                <li>2- {t("service1-step4")}</li>
                <li>3- {t("service3-step5")}</li>
              </>
            ) : id == 5 ? (
              <>
                <li>4- {t("service1-step4")}</li>
                <li>5- {t("service5-step5")}</li>
                <li>6- {t("service5-step6")}</li>
                <li>7- {t("service5-step7")}</li>
              </>
            ) : id == 6 ? (
              <>
                <li>2- {t("service1-step4")}</li>
                <li>3- {t("service3-step5")}</li>
              </>
            ) : id == 7 ? (
              <>
                {/* <li>1- {t('service3-step2')}</li> */}
                <li>1- {t("service1-step2")}</li>
                <li>2- {t("service7-step3")}</li>
                <li>3- {t("service7-step4")}</li>
              </>
            ) : id == 8 ? (
              <>
                <li>1- {t("service8-step2")}</li>
                <li>2- {t("service8-step3")}</li>
              </>
            ) : null}
          </ul>
          <h2
            style={
              localStorage.getItem("i18nextLng") == "ar"
                ? { textAlign: "right", width: "100%", color: "#ad8700" }
                : { textAlign: "left", width: "100%", color: "#ad8700" }
            }
          >
            {t("service-worning")}
          </h2>
          <ul
            className="list-steps"
            style={
              localStorage.getItem("i18nextLng") == "ar"
                ? { direction: "rtl", width: "100%", color: "#ad8700" }
                : { direction: "ltr", width: "100%", color: "#ad8700" }
            }
          >
            <li>1- {t(`service${id}-w1`)}</li>
            <li>2- {t(`service${id}-w2`)}</li>
          </ul>
          {id == 1 || id == 2 || id == 3 || id == 4 || id == 5 || id == 6 ? (
            <h2 style={{ color: "#d3cccc" ,textAlign:"center" ,width:"90%"}}>{localStorage.getItem("i18nextLng") == "ar" ? service.payment_note_ar : service.payment_note}</h2>
          ) : null}

          <button onClick={handleNext} className="sub-now">
            {t("sub-now")}
          </button>
        </div>
      </div>
    </div>

    // <div className='inst' style={localStorage.getItem('i18nextLng') == 'ar' ? { direction: 'rtl' } : { direction: 'ltr' }}>
    //   {errors2 && (
    //     <PopupError
    //       message={errors2}
    //       onClose={handleCloseError}
    //     />
    //   )}

    //   {id == 1 ?

    //     <div className="inst-container">
    //     <div className="information-service">

    //       <div className="information-service_body">
    //         <h1>{t('service2-name')}</h1>
    //         <hr style={{ width: "60%" }} />
    //         <h2 style={localStorage.getItem('i18nextLng') == 'ar' ? { textAlign: 'right', width: "100%" } : { textAlign: 'left', width: "100%" }}>
    //           {t('service-steps')}
    //         </h2>
    //         <ul className='list-steps' style={localStorage.getItem('i18nextLng') == 'ar' ? { direction: 'rtl', width: '100%' } : { direction: 'ltr', width: '100%' }}>
    //           <li>1- {t('service1-step1')}</li>
    //           <li>2- {t('service1-step2')}</li>
    //           <li>*** {t('service1-step3')} ***</li>
    //           <li>3- {t('service1-step4')}</li>
    //           <li>4- {t('service1-step5')}</li>
    //           <li>5- {t('service1-step6')}</li>
    //         </ul>
    //         <button onClick={handleNext} className='sub-now'>{t('sub-now')}</button>
    //       </div>
    //     </div>
    //   </div>

    //     : id == 2 ?

    //       <div className="inst-container">
    //         <div className="information-service">
    //           <img src="../assets/librarylog.jpg" alt="" />
    //           <div className="information-service_body">
    //             <h1>{t('service2-name')}</h1>
    //             <hr style={{ width: "60%" }} />
    //             <h2 style={localStorage.getItem('i18nextLng') == 'ar' ? { textAlign: 'right', width: "100%" } : { textAlign: 'left', width: "100%" }}>
    //               {t('service-steps')}
    //             </h2>
    //             <ul className='list-steps' style={localStorage.getItem('i18nextLng') == 'ar' ? { direction: 'rtl', width: '100%' } : { direction: 'ltr', width: '100%' }}>
    //               <li>1- {t('service1-step1')}</li>
    //               <li>2- {t('service1-step2')}</li>
    //               <li>*** {t('service1-step3')} ***</li>
    //               <li>3- {t('service1-step4')}</li>
    //               <li>4- {t('service2-step5')}</li>
    //               <li>5- {t('service2-step6')}</li>
    //             </ul>
    //             <button onClick={handleNext} className='sub-now'>{t('sub-now')}</button>
    //           </div>
    //         </div>
    //       </div>

    //       : id == 3 ?

    //         <div className="inst-container">
    //           <div className="information-service">
    //             <img src="../assets/librarylog.jpg" alt="" />
    //             <div className="information-service_body">
    //               <h1>{t('service2-name')}</h1>
    //               <hr style={{ width: "60%" }} />
    //               <h2 style={localStorage.getItem('i18nextLng') == 'ar' ? { textAlign: 'right', width: "100%" } : { textAlign: 'left', width: "100%" }}>
    //                 {t('service-steps')}
    //               </h2>
    //               <ul className='list-steps' style={localStorage.getItem('i18nextLng') == 'ar' ? { direction: 'rtl', width: '100%' } : { direction: 'ltr', width: '100%' }}>
    //                 <li>1- {t('service1-step1')}</li>
    //                 <li>*** {t('service1-step3')} ***</li>
    //                 <li>3- {t('service1-step4')}</li>
    //                 <li>4- {t('service3-step5')}</li>
    //               </ul>
    //               <button onClick={handleNext} className='sub-now'>{t('sub-now')}</button>
    //             </div>
    //           </div>
    //         </div>

    //         : id == 4 ?
    //           <div className="inst-container">
    //             <div className="information-service">
    //               <img src="../assets/librarylog.jpg" alt="" />
    //               <div className="information-service_body">
    //                 <h1>{t('service4-name')}</h1>
    //                 <hr style={{ width: "60%" }} />
    //                 <h2 style={localStorage.getItem('i18nextLng') == 'ar' ? { textAlign: 'right', width: "100%" } : { textAlign: 'left', width: "100%" }}>
    //                   {t('service-steps')}
    //                 </h2>
    //                 <ul className='list-steps' style={localStorage.getItem('i18nextLng') == 'ar' ? { direction: 'rtl', width: '100%' } : { direction: 'ltr', width: '100%' }}>
    //                   <li>1- {t('service1-step1')}</li>
    //                   <li>*** {t('service1-step3')} ***</li>
    //                   <li>2- {t('service1-step4')}</li>
    //                   <li>3- {t('service3-step5')}</li>

    //                 </ul>
    //                 <button onClick={handleNext} className='sub-now'>{t('sub-now')}</button>
    //               </div>
    //             </div>
    //           </div>
    //           : id == 5 ?
    //             <div>
    //               <div className="inst-container">
    //                 <div className="information-service">
    //                   <img src="../assets/librarylog.jpg" alt="" />
    //                   <div className="information-service_body">
    //                     <h1>{t('service5-name')}</h1>
    //                     <hr style={{ width: "60%" }} />
    //                     <h2 style={localStorage.getItem('i18nextLng') == 'ar' ? { textAlign: 'right', width: "100%" } : { textAlign: 'left', width: "100%" }}>
    //                       {t('service-steps')}
    //                     </h2>
    //                     {/* <ul className='list-steps' style={localStorage.getItem('i18nextLng') == 'ar' ? { direction: 'rtl', width: '100%' } : { direction: 'ltr', width: '100%' }}>
    //                     <li>1- {t('service1-step1')}</li>
    //                     <li>2- {t('service1-step2')}</li>
    //                     <li>3- {t('service1-step3')}</li>
    //                     <li>4- {t('service1-step4')}</li>
    //                     <li>5- {t('service1-step5')}</li>
    //                     <li>6- {t('service1-step6')}</li>
    //                   </ul>
    //                   <button onClick={handleNext} className='sub-now'>{t('sub-now')}</button> */}
    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="inst-container">
    //                 <div className="information-service">
    //                   <div className="information-service_body">
    //                     <h1>{t('service5-name')}</h1>
    //                     <hr style={{ width: "60%" }} />
    //                     <h2 style={localStorage.getItem('i18nextLng') == 'ar' ? { textAlign: 'right', width: "100%" } : { textAlign: 'left', width: "100%" }}>
    //                       {t('service-steps')}
    //                     </h2>
    //                     {/* <ul className='list-steps' style={localStorage.getItem('i18nextLng') == 'ar' ? { direction: 'rtl', width: '100%' } : { direction: 'ltr', width: '100%' }}>
    //                     <li>1- {t('service1-step1')}</li>
    //                     <li>2- {t('service1-step2')}</li>
    //                     <li>3- {t('service1-step3')}</li>
    //                     <li>4- {t('service1-step4')}</li>
    //                     <li>5- {t('service1-step5')}</li>
    //                     <li>6- {t('service1-step6')}</li>
    //                   </ul>
    //                   <button onClick={handleNext} className='sub-now'>{t('sub-now')}</button> */}
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //             : id == 6 ?
    //               <div className="inst-container">
    //                 <div className="information-service">
    //                   <img src="../assets/librarylog.jpg" alt="" />
    //                   <div className="information-service_body">
    //                     <h1>{t('service6-name')}</h1>
    //                     <hr style={{ width: "60%" }} />
    //                     <h2 style={localStorage.getItem('i18nextLng') == 'ar' ? { textAlign: 'right', width: "100%" } : { textAlign: 'left', width: "100%" }}>
    //                       {t('service-steps')}
    //                     </h2>
    //                     <ul className='list-steps' style={localStorage.getItem('i18nextLng') == 'ar' ? { direction: 'rtl', width: '100%' } : { direction: 'ltr', width: '100%' }}>
    //                       <li>1- {t('service1-step1')}</li>
    //                       <li>*** {t('service1-step3')} ***</li>
    //                       <li>2- {t('service1-step4')}</li>
    //                       <li>3- {t('service3-step5')}</li>
    //                     </ul>
    //                     <button onClick={handleNext} className='sub-now'>{t('sub-now')}</button>
    //                   </div>
    //                 </div>
    //               </div>
    //               : id == 7 ?
    //                 <div className="inst-container">
    //                   <div className="information-service">
    //                     <img src="../assets/librarylog.jpg" alt="" />
    //                     <div className="information-service_body">
    //                       <h1>{t('service1-name')}</h1>
    //                       <hr style={{ width: "60%" }} />
    //                       <h2 style={localStorage.getItem('i18nextLng') == 'ar' ? { textAlign: 'right', width: "100%" } : { textAlign: 'left', width: "100%" }}>
    //                         {t('service-steps')}
    //                       </h2>
    //                       <ul className='list-steps' style={localStorage.getItem('i18nextLng') == 'ar' ? { direction: 'rtl', width: '100%' } : { direction: 'ltr', width: '100%' }}>
    //                         <li>1- {t('service1-step1')}</li>
    //                         <li>2- {t('service1-step2')}</li>
    //                         <li>3- {t('service1-step3')}</li>
    //                         <li>4- {t('service1-step4')}</li>
    //                         <li>5- {t('service1-step5')}</li>
    //                         <li>6- {t('service1-step6')}</li>
    //                       </ul>
    //                       <button onClick={handleNext} className='sub-now'>{t('sub-now')}</button>
    //                     </div>
    //                   </div>
    //                 </div>
    //                 : id == 8 ?
    //                   <div className="inst-container">
    //                     <div className="information-service">
    //                       <img src="../assets/librarylog.jpg" alt="" />
    //                       <div className="information-service_body">
    //                         <h1>{t('service2-name')}</h1>
    //                         <hr style={{ width: "60%" }} />
    //                         <h2 style={localStorage.getItem('i18nextLng') == 'ar' ? { textAlign: 'right', width: "100%" } : { textAlign: 'left', width: "100%" }}>
    //                           {t('service-steps')}
    //                         </h2>
    //                         <ul className='list-steps' style={localStorage.getItem('i18nextLng') == 'ar' ? { direction: 'rtl', width: '100%' } : { direction: 'ltr', width: '100%' }}>
    //                           <li>1- {t('service1-step1')}</li>
    //                           <li>2- {t('service1-step2')}</li>
    //                           <li>3- {t('service1-step3')}</li>
    //                           <li>4- {t('service1-step4')}</li>
    //                           <li>5- {t('service1-step5')}</li>
    //                           <li>6- {t('service1-step6')}</li>
    //                         </ul>
    //                         <button onClick={handleNext} className='sub-now'>{t('sub-now')}</button>
    //                       </div>
    //                     </div>
    //                   </div>
    //                   : null
    //   }

    // </div>
  );
};

export default Instructons;
