import React, { useState, useEffect } from "react";
import { BiImageAdd } from "react-icons/bi";
import axios from "axios";
import { API_URL } from "../../config";
import { t } from "i18next";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Serimg from "../../images/serIMG.png";
import { AiFillCloseCircle } from "react-icons/ai";
import PopupErrorMsg from "../../components/error/PopupErrorMsg";
import PopupConfirmMsg from "../../components/error/PopupConfirmMsg";
import { BsFilePdf, BsFileEarmarkWord } from "react-icons/bs";

const Ser2 = ({ ser }) => {
  const id = ser.service_id;
  const id2 = ser.ser_formation;
  const status = ser.status;

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({ started: false, value: 0 });
  const [msg, setMsg] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const [data, setData] = useState({
    payment_photo: "",
    research: "",
    research_word: "",
    form: "",
    service_id: id,
    application_id: id2,
  });

  useEffect(() => {
    axios.defaults.withCredentials = true;

    try {
      axios
        .get(`${API_URL}/auth/check`, { withCredentials: true })
        .then((res) => { })
        .catch((err) => {
          // console.log(err);
          setDisabled(true);
          window.location.replace("/Library/login");

        });
    } catch (err) {
      // console.log(err);
    }

    if (status == 3) {
      try {
        //هنعدل الداتا
        axios
          .get(`${API_URL}/StepTwoRegEdit/${id}/${id2}`, {
            withCredentials: true,
          })
          .then((res) => {
            setData({
              payment_photo: res.data.photo_payment_receipt,
              research: res.data.message_pdf_ar,
              research_word: res.data.message_word_ar,
              form: res.data?.quote_check_form ? res.data.quote_check_form : "",
            });
          })
          .catch((err) => {
            // console.log(err);
          });
      } catch (err) {
        // console.log(err);
      }
    }
  }, []);

  const handleCloseError = () => {
    setError("");
    setConfirm(false);
  };

  const confirmf = () => {
    setConfirm(true);
  };

  const handleSubmit = () => {
    setConfirm(false);
    axios.defaults.withCredentials = true;
    if (!data.payment_photo) {
      setError(t(`service${id}-step-two-err.payment-photo`));
      return;
    }

    if (!data.research) {
      setError(t(`service${id}-step-two-err.research`));
      return;
    } else if (data.research?.name) {
      const validExtensions = /\.(pdf)$/i; // Regular expression pattern for valid file extensions
      if (!validExtensions.test(data.research.name)) {
        setError(t(`service${id}-step-two-err.research`));
        return;
      }
    }
    if (!data.research_word) {
      setError(t(`service${id}-step-two-err.research-word`));
      return;
    } else if (data.research_word?.name) {
      const validExtensions2 = /\.(doc|docx)$/i; // Regular expression pattern for valid file extensions
      if (!validExtensions2.test(data.research_word.name)) {
        setError(t(`service${id}-step-two-err.research-word`));
        return;
      }
    }
    if (!data.form) {
      setError(t(`service${id}-step-two-err.form`));
      return;
    }
    // allaow data.form to be empty and if it is not empty check if it is pdf or word or image

    if (data.form?.name) {
      const validExtensions3 = /\.(pdf|doc|docx|jpg|jpeg|png)$/i; // Regular expression pattern for valid file extensions
      if (!validExtensions3.test(data.form.name)) {
        setError(t(`service${id}-step-two-err.form`));
        return;
      }
    }


    const formData = new FormData();
    formData.append("payment_photo", data.payment_photo);
    formData.append("research", data.research);
    formData.append("research_word", data.research_word);
    if (data.form) {
      formData.append("form", data.form);
    }
    formData.append("service_id", data.service_id);
    formData.append("application_id", data.application_id);

    setProgress((prevState) => ({ ...prevState, started: true }));
    setMsg(t("uploading"));

    try {
      axios
        .put(`${API_URL}/StepTwoSer2/${id}/${id2}`, formData, {
          withCredentials: true,
          onUploadProgress: (ProgressEvent) => {
            setDisabled(true);
            let percentCompleted = Math.round(
              (ProgressEvent.loaded * 100) / ProgressEvent.total
            );
            setProgress((prevState) => ({
              ...prevState,
              value: percentCompleted,
            }));
          },
        })
        .then((res) => {
          alert("done");
          navigate(`/Library`);
        })
        .catch((err) => {
          if (err.response.status == 401) {
            return window.location.replace("/Library/login");
          }
          setError(err.response.data.message[0]);
          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data[0]
          ) {
            if (
              !err.response.data[0].user &&
              err.response.data[0].user != undefined
            ) {
              return window.location.replace("/Library/login");
            }
          }
          setMsg(null);
          setProgress((prevState) => ({
            ...prevState,
            started: false,
            value: 0,
          }));
          setDisabled(false);
        });
    } catch (err) {
      // console.log(err);
      console.log(err.response.data);
      setDisabled(false);
    }
  };

  return (
    <div className="inst">
      <div
        className="req"
        style={
          localStorage.getItem("i18nextLng") == "en"
            ? { direction: "ltr" }
            : { direction: "rtl" }
        }
      >
        <div className="inst-container">
          <img src="../../assets/librarylog.jpg" alt="" />
          <div className="information-service_body">
            <h1>{t(`service${id}-name`)}</h1>
            <hr style={{ width: "60%" }} />
            <div className="data-c">
              <div className="img-btn">
                <img src={Serimg} alt="" className="ImageService" />

                <div className="progress">
                  {progress.started && (
                    <progress max="100" value={progress.value}></progress>
                  )}
                  {msg && <p>{msg}</p>}
                </div>
                <button
                  disabled={disabled}
                  onClick={confirmf}
                  className="sub-now"
                >
                  {t("submet")}
                </button>
              </div>
              {confirm && (
                <PopupConfirmMsg
                  message={t("confirm-msg")}
                  onClose={handleCloseError}
                  onSubmit={handleSubmit}
                />
              )}
              <div className="inputt">
                <div className="select-img">
                  <span className="title-upload">
                    {t(`service${id}-step-two.payment-photo`)}
                  </span>
                  <label className="upload-image" htmlFor="upload-image0">
                    <BiImageAdd className="img-icom" />
                    <p>{t("click-here")}</p>
                  </label>
                  <input
                    type="file"
                    hidden
                    id="upload-image0"
                    name="upload-image0"
                    onChange={(e) => {
                      setData({ ...data, payment_photo: e.target.files[0] });
                    }}
                  />
                  {data.payment_photo && (
                    <div>
                      <p className="upload-image value">
                        {data.payment_photo.name
                          ? data.payment_photo.name
                          : data.payment_photo}
                      </p>
                      <button
                        className="upload-image openPdf"
                        onClick={() => {
                          if (data.payment_photo.name) {
                            return window.open(
                              URL.createObjectURL(data.payment_photo)
                            );
                          } else {
                            return window.open(
                              `${API_URL}/${ser.national_id}/${data.payment_photo}`
                            );
                          }
                        }}
                      >
                        {t("open")}
                      </button>
                      <AiFillCloseCircle
                        onClick={() => {
                          setData({ ...data, payment_photo: "" });
                        }}
                        style={{
                          color: "#ad8700",
                          fontSize: "2rem",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="select-img">
                  <span className="title-upload">
                    {t(`service${id}-step-two.research`)}
                  </span>
                  <label className="upload-image" htmlFor="upload-image2">
                    <BsFilePdf className="img-icom" />
                    <p>{t("click-here")}</p>
                  </label>
                  <input
                    type="file"
                    hidden
                    id="upload-image2"
                    name="upload-image2"
                    onChange={(e) => {
                      setData({ ...data, research: e.target.files[0] });
                    }}
                  />
                  {data.research && (
                    <div>
                      <p className="upload-image value">
                        {data.research.name
                          ? data.research.name
                          : data.research}
                      </p>
                      <button
                        className="upload-image openPdf"
                        onClick={() => {
                          if (data.research.name) {
                            return window.open(
                              URL.createObjectURL(data.research)
                            );
                          } else {
                            return window.open(
                              `${API_URL}/${ser.national_id}/${data.research}`
                            );
                          }
                        }}
                      >
                        {t("open")}
                      </button>
                      <AiFillCloseCircle
                        onClick={() => {
                          setData({ ...data, research: "" });
                        }}
                        style={{
                          color: "#ad8700",
                          fontSize: "2rem",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="select-img">
                  <span className="title-upload">
                    {t(`service${id}-step-two.research-word`)}
                  </span>
                  <label className="upload-image" htmlFor="upload-image4">
                    <BsFileEarmarkWord className="img-icom" />
                    <p>{t("click-here")}</p>
                  </label>
                  <input
                    type="file"
                    hidden
                    id="upload-image4"
                    name="upload-image4"
                    onChange={(e) => {
                      setData({ ...data, research_word: e.target.files[0] });
                    }}
                  />
                  {data.research_word && (
                    <div className="text-container">
                      <p className="upload-image value">
                        {data.research_word.name
                          ? data.research_word.name
                          : data.research_word}
                      </p>
                      <button
                        className="upload-image openPdf"
                        onClick={() => {
                          if (data.research_word.name) {
                            return window.open(
                              URL.createObjectURL(data.research_word)
                            );
                          } else {
                            return window.open(
                              `${API_URL}/${ser.national_id}/${data.research_word}`
                            );
                          }
                        }}
                      >
                        {t("open")}
                      </button>
                      <AiFillCloseCircle
                        onClick={() => {
                          setData({ ...data, research_word: "" });
                        }}
                        style={{
                          color: "#ad8700",
                          fontSize: "2rem",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="select-img">
                  <span className="title-upload">
                    {t(`service${id}-step-two.form`)}
                  </span>
                  <label className="upload-image" htmlFor="upload-image5">
                    <BiImageAdd className="img-icom" />
                    <p>{t("click-here")}</p>
                  </label>
                  <input
                    type="file"
                    hidden
                    id="upload-image5"
                    name="upload-image5"
                    onChange={(e) => {
                      setData({ ...data, form: e.target.files[0] });
                    }}
                  />
                  {data.form && (
                    <div>
                      <p className="upload-image value">
                        {data.form.name ? data.form.name : data.form}
                      </p>
                      <button
                        className="upload-image openPdf"
                        onClick={() => {
                          if (data.form.name) {
                            return window.open(URL.createObjectURL(data.form));
                          } else {
                            return window.open(
                              `${API_URL}/${ser.national_id}/${data.form}`
                            );
                          }
                        }}
                      >
                        {t("open")}
                      </button>
                      <AiFillCloseCircle
                        onClick={() => {
                          setData({ ...data, form: "" });
                        }}
                        style={{
                          color: "#ad8700",
                          fontSize: "2rem",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {error && (
                <PopupErrorMsg message={error} onClose={handleCloseError} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ser2;
