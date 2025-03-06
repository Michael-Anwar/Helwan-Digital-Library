import "./show.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import pimg from "../../../../images/Ellipse 1.png";
import { API_URL } from "../../../../config";
import PopupErrorMsg from "../../../../components/error/PopupErrorMsg";
import PopupConfirmMsg from "../../../../components/error/PopupConfirmMsg";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineDown } from "react-icons/ai";


const ShowOnly = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const pdfRef = useRef();
  const [rejRes, SetRejRes] = useState("");
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState({ started: false, value: 0 });
  const [disabled, setDisabled] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [payment_code, setPayment_code] = useState("");

  const [confirmE1, setConfirmE1] = useState(false);
  const [confirmE2, setConfirmE2] = useState(false);
  const [confirmA1, setConfirmA1] = useState(false);
  const [confirmA2, setConfirmA2] = useState(false);
  const [confirmR1, setConfirmR1] = useState(false);
  const [confirmR2, setConfirmR2] = useState(false);
  const [confirmReturn, setConfirmReturn] = useState(false);
  const [confirmP, setConfirmP] = useState(false);
  const [confirmW, setConfirmW] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const getUpdatedHistory = (historyJsonString) => {
    try {
      const historyObj = historyJsonString;
      // Check if the parsed value is an object
      if (typeof historyObj === 'object' && historyObj !== null) {
        // Convert the object into an array of React elements
        const historyElements = Object.keys(historyObj).map((reasonKey) => (
          <div key={reasonKey} className="history-item">
            <span className="detail"> {historyObj[reasonKey].detail}</span>
            <span className="date"> {format(historyObj[reasonKey].date)}</span>
          </div>
        ));
  
        // Return the array of React elements
        return (
          <div className="history-list">
            {historyElements}
          </div>
        );
      } else {
        // Handle the case when the parsed value is not an object
        return null;
      }
    } catch (error) {
      // Handle JSON parsing error
      console.error('Error parsing JSON:', error);
      return null;
    }
  };
  

  const dataArray = id.split(",");
  const [response, setResponse] = useState({
    response_text: '',
    response_pdf: '',
  });
  const [action, setAction] = useState({
    status: 0,
    column: "",
    reason: "",
    student_id: "",
    ser_id: "",
    ser_name: "",
    app_id: "",
  });

  const [data, SetData] = useState({
    student_id: dataArray[0],
    ser_id: dataArray[1],
    ser_name: dataArray[2],
    app_id: dataArray[3],
  });

  const navigate = useNavigate();
  const [user, setUser] = useState({});
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get(
        `${API_URL}/user/getuserbyid/${data.ser_id}/${data.ser_name}/${data.student_id}/${data.app_id}`,
        { withCredentials: true }
      )
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        if (error.response.status == 401) window.location.replace("/Library/ManagerLogin");
      });
    axios.get(`${API_URL}/user/getAllFaculties`)
      .then((res) => {
        setFaculty(res.data);
      })
      .catch(() => {
        // console.log(err);
      });
  }, []);
  const openImage = (url) => {
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.target = "_blank";
    aTag.click();
    aTag.remove();
  };
  const downloadImage = (url) => {
    saveAs(url, "image.jpg");
  };

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

  const [errors, setErrors] = useState();



  console.log(user);
  const handleCloseError = () => {
    setErrors("");
    setConfirm(false);
    setConfirmA1(false);
    setConfirmA2(false);
    setConfirmR1(false);
    setConfirmR2(false);
    setConfirmE1(false);
    setConfirmE2(false);
    setConfirmReturn(false);
    setConfirmP(false);
    setConfirmW(false);
    setConfirmEdit(false);
  };







  const handleEditUser = () => {
    setDisabled(true);
    try {
      axios.defaults.withCredentials = true;
      axios.put(`${API_URL}/user/updateuserManager`, user, { withCredentials: true })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          setDisabled(false);
          if (error.response && error.response.status === 401) {
            navigate("/Library/ManagerLogin");
          } else if (error.response && error.response.status === 400) {
            setErrors(error.response?.data?.errors[0]?.message);
          } else {
            setErrors("حدث خطأ ما");
          }
        });
    } catch (error) {
      setDisabled(false);
      setErrors("حدث خطأ ما");
    }


  }


  return (
    <>
      {confirmEdit && (
        <PopupConfirmMsg
          message={"تأكيد تعديل بيانات الطالب"}
          onClose={handleCloseError}
          onSubmit={handleEditUser}
        />
      )}
      <section className="cotainer-data">
        <div className="data-container" ref={pdfRef}>
          <div className="image-con">
            <img src={user.img ? `${API_URL}/${user.national_id}/${user.img}` : pimg}
              alt="img"
              className="imagee"
            />
          </div>

          <div className="data-con-table-btn">
            <table className="data-table" style={{ direction: "rtl" }}>
              <tr>
                <th> معلومات اساسيه </th>
                <th> البيانات </th>
              </tr>

              <tr>
                <td>الاسم</td>
                <td>
                  <input
                    className="edit-input-user"
                    type="text"
                    value={user.name}
                    onChange={(e) => {
                      setUser({ ...user, name: e.target.value });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>الجنسيه</td>
                {/* <td>{user.nationality}</td> */}
                <td>
                  <input
                    className="edit-input-user"
                    type="text"
                    value={user.nationality}
                    onChange={(e) => {
                      setUser({ ...user, nationality: e.target.value });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>البريد الالكترونى</td>
                <td>
                  <input
                    className="edit-input-user"
                    type="text"
                    value={user.email}
                    onChange={(e) => {
                      setUser({ ...user, email: e.target.value });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>رقم الهاتف</td>
                {/* <td>{user.phone}</td> */}
                <td>
                  <input
                    className="edit-input-user"
                    type="text"
                    value={user.phone}
                    onChange={(e) => {
                      setUser({ ...user, phone: e.target.value });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>الرقم القومى</td>
                <td>{user.national_id}</td>
              </tr>
              <tr>
                <td>الجامعه</td>
                <td>
                  {+user.university === 1 ? "جامعه حلوان" : user.university}
                </td>

              </tr>

              <tr>
                <td>الكليه</td>
                <td>{user.faculty_name_ar ? user.faculty_name_ar : user.faculity}</td>
              </tr>
              <tr>
                <td>القسم</td>
                {/* <td>{user.department}</td> */}
                <td>
                  <input
                    className="edit-input-user"
                    type="text"
                    value={user.department}
                    onChange={(e) => {
                      setUser({ ...user, department: e.target.value });
                    }}
                  />
                </td>
              </tr>
              {(user.level !== null || user.level !== undefined || user.level !== "") && (
                <tr>
                  <td> المرحله </td>
                  <td>
                    {user.level == 0
                      ? "ماجستير"
                      : user.level == 1
                        ? "دكتوراه"
                        : null}
                  </td>
                </tr>
              )}
              <tr>
                <td>تاريخ طلب كود الدفع</td>
                <td>
                  {
                    user.req_code_date ? format(user.req_code_date) : null
                  }

                </td>
              </tr>
              {user.submit_date && (
                <tr>
                  <td>تاريخ الطلب</td>
                  <td>
                    {
                      user.submit_date ? format(user.submit_date) : null
                    }
                  </td>
                </tr>
              )}
              {user.edit_date && (
                <tr>
                  <td>تاريخ اخر تعديل</td>
                  <td>
                    {
                      user.edit_date ? format(user.edit_date) : null
                    }
                  </td>
                </tr>
              )}
              <tr>
                <td> نوع الخدمه </td>
                <td>{user.service_name_ar}</td>
              </tr>
              {/* {user.level && (
                <tr>
                  <td> المرحله </td>
                  <td>
                    {user.level == 0
                      ? "ماجستير"
                      : user.level == 1
                        ? "دكتوراه"
                        : null}
                  </td>
                </tr>
              )} */}
              {user.academic && (
                <tr>
                  <td> الشعبه </td>
                  <td>{user.academic}</td>
                </tr>
              )}
              {user.files_numbers && (
                <tr>
                  <td> عدد الابحاث </td>
                  <td>
                    <input
                      className="edit-input-user"
                      type="text"
                      value={user.files_numbers}
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        // Check if the input is not empty
                        if (inputValue.trim() !== "") {
                          setUser({ ...user, files_numbers: inputValue });
                        } else {
                          // Display an error or handle it in another way (e.g., show a message)
                          alert("يجب ادخال رقم");
                        }
                      }}
                    />
                  </td>
                  {/* <td>{user.files_numbers}</td> */}
                </tr>
              )}
              {user.research_list && (
                <tr>
                  <td> {t(`service5-step-two.research_list`)} </td>
                  <td className="att-row">
                    <button
                      onClick={() => {
                        openImage(
                          `${API_URL}/${user.national_id}/${user.research_list}`
                        );
                      }}
                      class="atch-btn"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => {
                        downloadImage(
                          `${API_URL}/${user.national_id}/${user.research_list}`, `${user.research_list}`
                        );
                      }}
                      class="atch-btn atch-btn2"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              )}
              {user.publish_date && (
                <tr>
                  <td> تاريخ النشر </td>
                  <td>{user.publish_date?.slice(0, 10)}</td>
                </tr>
              )}
              {user.accept_date && (
                <tr>
                  <td> تاريخ قبول النشر </td>
                  <td>{user.accept_date?.slice(0, 10)}</td>
                </tr>
              )}
            </table>
            <button
              className="atch-btn"
              onClick={() => {
                setConfirmEdit(true);
              }}
              disabled={disabled}
            >
              تعديل بيانات الطالب
              <BiEditAlt />
            </button>
          </div>
        </div>
        {user.hestory_edit !== "" ? (
                  <div className="response-text__container">
                    <h2>
                      طلبات التعديل السابقه
                    </h2>
                    <AiOutlineDown 
                    onClick={() => setShowHistory(!showHistory)}
                    style={{ 
                      cursor: "pointer", 
                      fontSize: "2rem" , 
                      color: "rgb(0, 60, 112)" ,
                      border: "1px solid rgb(0, 60, 112)", 
                      borderRadius: "5px",
                    }}
                     />

                    <div className="response-text" style={showHistory ? { display: "flex" } : { display: "none" }}>
                      {getUpdatedHistory(user.hestory_edit)}
                    </div>
                  </div>
                ) : null}
        <h1>مرفقات الطالب</h1>

        <table class="profile-table">
          <thead>
            <th>المرفقات</th>
            <th>التحكم</th>
          </thead>

          {user.photo_payment_receipt && (
            <tr>
              <td> صوره ايصال الدفع </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.photo_payment_receipt}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.photo_payment_receipt}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.photo_college_letter && (
            <tr>
              <td> {t("letter")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.photo_college_letter}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.photo_college_letter}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.research_plan_ar_pdf && (
            <tr>
              <td> {t("research")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_ar_pdf}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_ar_pdf}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.research_plan_ar_word && (
            <tr>
              <td>{t("research-word")}</td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_ar_word}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_ar_word}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.research_plan_en_word && (
            <tr>
              <td> {t("research-word-en")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_en_word}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_en_word}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.research_plan_en_pdf && (
            <tr>
              <td> {t("research-en")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_en_pdf}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_en_pdf}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.translation_paper && (
            <tr>
              <td>{t("translation")}</td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.translation_paper}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.translation_paper}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.message_word_ar && (
            <tr>
              <td> {t("service2-step-two.research-word")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.message_word_ar}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.message_word_ar}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.message_pdf_ar && (
            <tr>
              <td> {t("service2-step-two.research")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.message_pdf_ar}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.message_pdf_ar}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.quote_check_form && (
            <tr>
              <td> {t("service2-step-two.form")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.quote_check_form}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.quote_check_form}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.decision && (
            <tr>
              <td> {t("service7-step3")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.decision}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.decision}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.files_numbers &&
            Array.from(Array(user.files_numbers), (e, i) => (
              <React.Fragment key={i}>
                {user[`research${i + 1}_image_word`] && (
                  <tr>
                    <td>
                      {" "}
                      {t(
                        `service${user.service_id}-step-two.word${i + 1}`
                      )}{" "}
                    </td>
                    <td className="att-row">
                      <button
                        onClick={() => {
                          openImage(
                            `${API_URL}/${user.national_id}/${user[`research${i + 1}_image_word`]
                            }`
                          );
                        }}
                        class="atch-btn"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => {
                          downloadImage(
                            `${API_URL}/${user.national_id}/${user[`research${i + 1}_image_word`]
                            }`
                          );
                        }}
                        class="atch-btn atch-btn2"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                )}
                {user[`research${i + 1}_image_pdf`] && (
                  <tr>
                    <td>
                      {" "}
                      {t(`service${user.service_id}-step-two.pdf${i + 1}`)}{" "}
                    </td>
                    <td className="att-row">
                      <button
                        onClick={() => {
                          openImage(
                            `${API_URL}/${user.national_id}/${user[`research${i + 1}_image_pdf`]
                            }`
                          );
                        }}
                        class="atch-btn"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => {
                          downloadImage(
                            `${API_URL}/${user.national_id}/${user[`research${i + 1}_image_pdf`]
                            }`
                          );
                        }}
                        class="atch-btn atch-btn2"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                )}
                {user[`acceptance_letter${i + 1}`] && (
                  <>
                    <tr>
                      <td>
                        {t(
                          `service${user.service_id
                          }-step-two.acceptance_letter${i + 1}`
                        )}{" "}
                      </td>
                      <td className="att-row">
                        <button
                          onClick={() => {
                            openImage(
                              `${API_URL}/${user.national_id}/${user[`acceptance_letter${i + 1}`]
                              }`
                            );
                          }}
                          class="atch-btn"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => {
                            downloadImage(
                              `${API_URL}/${user.national_id}/${user[`acceptance_letter${i + 1}`]
                              }`
                            );
                          }}
                          class="atch-btn atch-btn2"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  </>
                )}
              </React.Fragment>
            ))}
        </table>


        <h1>الرد المرسل من المكتبه</h1>
        <hr style={{ width: "90%", marginBottom: "1rem", height: "3px" }} />
        <div className="resp-cont">
          <div className="resp">
            <h2>
              <span style={{ color: "#19355a" }}>{t("date-response")} </span> :{" "}
              {user.response_date && user.response_date !== "null" && (user.status == 5 || user.status == 6)
                ? format(user.response_date)
                : "لم يتم الرد بعد"}
            </h2>
          </div>

          <div className="resp">
            <h2>
              <span style={{ color: "#19355a" }}>{t("res-code")}</span>:{" "}
              {user.payment_code ? (
                user.payment_code
              ) : (
                "لم يتم ارسال كود الدفع بعد"
              )}
            </h2>
          </div>
          <div className="resp">
            <h2>
              <span style={{ color: "#19355a" }}>{t("notes")}</span>
              {user.response_text && user.response_text !== "null" && user.response_text !== null ? (
                user.response_text
              ) : 'لم يتم ارسال ملحوظات بعد'}
            </h2>
          </div>
          <div className="resp">
            <div className="inputt-atch">
              {user.response_pdf !== null ? (
                <div className="atch-btns">
                  <button
                    onClick={() => {
                      openImage(
                        `${API_URL}/${user.national_id}/${user.response_pdf}`
                      );
                    }}
                    className="atch-btn"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => {
                      downloadImage(
                        `${API_URL}/${user.national_id}/${user.response_pdf}`
                      );
                    }}
                    className="atch-btn atch-btn2"
                  >
                    Download
                  </button>
                </div>
              ) : user.response_pdf === null ? (
                <h3>لم يتم ارسال ملف الرد </h3>
              ) : null}
              <h2>
                <span style={{ color: "#19355a" }}>{t("att-res")}</span>{" "}
              </h2>
            </div>
          </div>


        </div>

      </section>
      {errors && <PopupErrorMsg message={errors} onClose={handleCloseError} />}
    </>
  );
};

export default ShowOnly;
