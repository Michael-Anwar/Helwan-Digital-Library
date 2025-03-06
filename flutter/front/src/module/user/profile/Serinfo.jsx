import React, { useState, useEffect } from "react";
import { API_URL } from "../../../config";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { saveAs } from "file-saver";

const Serinfo = ({ service, User }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();




  const id = service.service_id;
  const id2 =
    service.ser_upgrade !== null
      ? service.ser_upgrade
      : service.ser_reg !== null
        ? service.ser_reg
        : service.ser_formation !== null
          ? service.ser_formation
          : service.ser_grant !== null
            ? service.ser_grant
            : service.ser_best !== null
              ? service.ser_best
              : service.ser_knowledge !== null
                ? service.ser_knowledge
                : service.ser_personal !== null
                  ? service.ser_personal
                  : service.ser_magazine !== null
                    ? service.ser_magazine
                    : null;

  const [data, setData] = useState({});
  const downloadImage = (url, filename) => {
    saveAs(url, filename);
  };
  const openImage = (url) => {
    const filename = url.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.target = "_blank";
    aTag.click();
    aTag.remove();
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;

    try {
      axios
        .get(`${API_URL}/auth/check`, { withCredentials: true })
        .then((res) => { })
        .catch((err) => {
          window.location.replace("/Library/login");
        });
    } catch (err) { }

    try {
      axios
        .get(`${API_URL}/StepTwoRegEdit/${id}/${id2}`, {
          withCredentials: true,
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          // console.log(err)
        });
    } catch (err) {
      // console.log(err);
    }
  }, [id2]);
  const number = data.files_numbers;

  // const increaseDateByOneDay = (date) => {
  //   const currentDate = new Date(date);
  //   currentDate.setDate(currentDate.getDate() + 1);
  //   return currentDate.toISOString().slice(0, 10);
  // };

  return (
    <div className="subnav-contentt" style={{ width: "80%" }}>
      <h1>
        {localStorage.getItem("i18nextLng") == "en"
          ? service.service_name
          : service.service_name_ar}
      </h1>
      <h1>{t("attach")}</h1>
      <hr style={{ width: "100%" }} />
      {data.req_code_date && data.submit_date && (
        <div className="inputt">
          {data.req_code_date && data.req_code_date !== null && (
            <h3>
              <span style={{ color: "#AD8700" }}> {t("date-code")}</span> :{" "}
              {data.req_code_date.slice(0, 10)}
            </h3>
          )}
          {data.submit_date && (
            <h3>
              <span style={{ color: "#AD8700" }}>{t("date-attach")}</span> :{" "}
              {data.submit_date.slice(0, 10)}
            </h3>
          )}
        </div>
      )}

      {!data.req_code_date && data.submit_date && (
        <h3>
          <span style={{ color: "#AD8700" }}>{t("date-attach")}</span> :{" "}
          {data.submit_date.slice(0, 10)}
        </h3>
      )}

      {data.level !== null && data.level !== "" && (
        <h2>
          <span style={{ color: "#AD8700" }}>{t("level")}</span> :{" "}
          {data.level == 0 ? t("master") : t("phd")}
        </h2>
      )}
      {data.academic && (
        <h2>
          <span style={{ color: "#AD8700" }}>{t("academic-div")}</span> :{" "}
          {data.academic}
        </h2>
      )}
      <div className="inputt">
        {data.photo_payment_receipt && (
          <div className="inputt-atch">
            <h3>{t("payment-photo")}</h3>
            <div className="atch-btns">
              <button
                className="atch-btn-open"
                onClick={() => {
                  openImage(
                    `${API_URL}/${User.national_id}/${data.photo_payment_receipt}`
                  );
                }}
                style={{ background: "#19355a" }}
                class="atch-btn"
              >
                {t("open")}
              </button>
              <button
                onClick={() => {
                  downloadImage(
                    `${API_URL}/${User.national_id}/${data.photo_payment_receipt}`, `${data.photo_payment_receipt}`
                  );
                }}
                style={{ background: "#AD8700" }}
                class="atch-btn"
              >
                {t("download")}
              </button>
            </div>
          </div>
        )}
        {data.photo_college_letter && (
          <div className="inputt-atch">
            <h3>{t("letter")}</h3>
            <div className="atch-btns">
              <button
                className="atch-btn-open"
                onClick={() => {
                  openImage(
                    `${API_URL}/${User.national_id}/${data.photo_college_letter}`
                  );
                }}
                style={{ background: "#19355a" }}
                class="atch-btn"
              >
                {t("open")}
              </button>
              <button
                onClick={() => {
                  downloadImage(
                    `${API_URL}/${User.national_id}/${data.photo_college_letter}`, `${data.photo_college_letter}`
                  );
                }}
                style={{ background: "#AD8700" }}
                class="atch-btn"
              >
                {t("download")}
              </button>
            </div>
          </div>
        )}
        {data.research_plan_ar_pdf && (
          <div className="inputt-atch">
            <h3>{t("research")}</h3>
            <div className="atch-btns">
              <button
                className="atch-btn-open"
                onClick={() => {
                  openImage(
                    `${API_URL}/${User.national_id}/${data.research_plan_ar_pdf}`
                  );
                }}
                style={{ background: "#19355a" }}
                class="atch-btn"
              >
                {t("open")}
              </button>
              <button
                onClick={() => {
                  downloadImage(
                    `${API_URL}/${User.national_id}/${data.research_plan_ar_pdf}`, `${data.research_plan_ar_pdf}`
                  );
                }}
                style={{ background: "#AD8700" }}
                class="atch-btn"
              >
                {t("download")}
              </button>
            </div>
          </div>
        )}
        {data.research_plan_ar_word && (
          <div className="inputt-atch">
            <h3>{t("research-word")}</h3>
            <div className="atch-btns">
              <button
                className="atch-btn-open"
                onClick={() => {
                  openImage(
                    `${API_URL}/${User.national_id}/${data.research_plan_ar_word}`
                  );
                }}
                style={{ background: "#19355a" }}
                class="atch-btn"
              >
                {t("open")}
              </button>
              <button
                onClick={() => {
                  downloadImage(
                    `${API_URL}/${User.national_id}/${data.research_plan_ar_word}`, `${data.research_plan_ar_word}`
                  );
                }}
                style={{ background: "#AD8700" }}
                class="atch-btn"
              >
                {t("download")}
              </button>
            </div>
          </div>
        )}
        {data.research_plan_en_word && (
          <div className="inputt-atch">
            <h3>{t("research-word-en")}</h3>
            <div className="atch-btns">
              <button
                className="atch-btn-open"
                onClick={() => {
                  openImage(
                    `${API_URL}/${User.national_id}/${data.research_plan_en_word}`
                  );
                }}
                style={{ background: "#19355a" }}
                class="atch-btn"
              >
                {t("open")}
              </button>
              <button
                onClick={() => {
                  downloadImage(
                    `${API_URL}/${User.national_id}/${data.research_plan_en_word}`, `${data.research_plan_en_word}`
                  );
                }}
                style={{ background: "#AD8700" }}
                class="atch-btn"
              >
                {t("download")}
              </button>
            </div>
          </div>
        )}
        {data.research_plan_en_pdf && (
          <div className="inputt-atch">
            <h3>{t("research-en")}</h3>
            <div className="atch-btns">
              <button
                className="atch-btn-open"
                onClick={() => {
                  openImage(
                    `${API_URL}/${User.national_id}/${data.research_plan_en_pdf}`
                  );
                }}
                style={{ background: "#19355a" }}
                class="atch-btn"
              >
                {t("open")}
              </button>
              <button
                onClick={() => {
                  downloadImage(
                    `${API_URL}/${User.national_id}/${data.research_plan_en_pdf}`, `${data.research_plan_en_pdf}`
                  );
                }}
                style={{ background: "#AD8700" }}
                class="atch-btn"
              >
                {t("download")}
              </button>
            </div>
          </div>
        )}
        {data.translation_paper && (
          <div className="inputt-atch">
            <h3>{t("translation")}</h3>
            <div className="atch-btns">
              <button
                className="atch-btn-open"
                onClick={() => {
                  openImage(
                    `${API_URL}/${User.national_id}/${data.translation_paper}`
                  );
                }}
                style={{ background: "#19355a" }}
                class="atch-btn"
              >
                {t("open")}
              </button>
              <button
                onClick={() => {
                  downloadImage(
                    `${API_URL}/${User.national_id}/${data.translation_paper}`, `${data.translation_paper}`
                  );
                }}
                style={{ background: "#AD8700" }}
                class="atch-btn"
              >
                {t("download")}
              </button>
            </div>
          </div>
        )}
        {data.message_word_ar && (
          <div className="inputt-atch">
            <h3>{t("service2-step-two.research-word")}</h3>
            <div className="atch-btns">
              <button
                className="atch-btn-open"
                onClick={() => {
                  openImage(
                    `${API_URL}/${User.national_id}/${data.message_word_ar}`
                  );
                }}
                style={{ background: "#19355a" }}
                class="atch-btn"
              >
                {t("open")}
              </button>
              <button
                onClick={() => {
                  downloadImage(
                    `${API_URL}/${User.national_id}/${data.message_word_ar}`, `${data.message_word_ar}`
                  );
                }}
                style={{ background: "#AD8700" }}
                class="atch-btn"
              >
                {t("download")}
              </button>
            </div>
          </div>
        )}
        {data.message_pdf_ar && (
          <div className="inputt-atch">
            <h3>{t("service2-step-two.research")}</h3>
            <div className="atch-btns">
              <button
                className="atch-btn-open"
                onClick={() => {
                  openImage(
                    `${API_URL}/${User.national_id}/${data.message_pdf_ar}`
                  );
                }}
                style={{ background: "#19355a" }}
                class="atch-btn"
              >
                {t("open")}
              </button>
              <button
                onClick={() => {
                  downloadImage(
                    `${API_URL}/${User.national_id}/${data.message_pdf_ar}`, `${data.message_pdf_ar}`
                  );
                }}
                style={{ background: "#AD8700" }}
                class="atch-btn"
              >
                {t("download")}
              </button>
            </div>
          </div>
        )}
        {data.quote_check_form && (
          <div className="inputt-atch">
            <h3>{t("service2-step-two.form")}</h3>
            <div className="atch-btns">
              <button
                className="atch-btn-open"
                onClick={() => {
                  openImage(
                    `${API_URL}/${User.national_id}/${data.quote_check_form}`
                  );
                }}
                style={{ background: "#19355a" }}
                class="atch-btn"
              >
                {t("open")}
              </button>
              <button
                onClick={() => {
                  downloadImage(
                    `${API_URL}/${User.national_id}/${data.quote_check_form}`, `${data.quote_check_form}`
                  );
                }}
                style={{ background: "#AD8700" }}
                class="atch-btn"
              >
                {t("download")}
              </button>
            </div>
          </div>
        )}
        {data.research_list && (
          <div className="inputt-atch">
            <h3>{t(`service5-step-two.research_list`)}</h3>
            <div className="atch-btns">
              <button
                className="atch-btn-open"
                onClick={() => {
                  openImage(`${API_URL}/${User.national_id}/${data.research_list}`);
                }}
                style={{ background: "#19355a" }}
                class="atch-btn"
              >
                {t("open")}
              </button>
              <button
                onClick={() => {
                  downloadImage(`${API_URL}/${User.national_id}/${data.research_list}`, `${data.research_list}`);
                }}
                style={{ background: "#AD8700" }}
                class="atch-btn"
              >
                {t("download")}
              </button>
            </div>
          </div>
        )}
        {data.decision && (
          <div className="inputt-atch">
            <h3>{t("service7-step3")}</h3>
            <div className="atch-btns">
              <button
                className="atch-btn-open"
                onClick={() => {
                  openImage(`${API_URL}/${User.national_id}/${data.decision}`);
                }}
                style={{ background: "#19355a" }}
                class="atch-btn"
              >
                {t("open")}
              </button>
              <button
                onClick={() => {
                  downloadImage(
                    `${API_URL}/${User.national_id}/${data.decision}`, `${data.decision}`
                  );
                }}
                style={{ background: "#AD8700" }}
                class="atch-btn"
              >
                {t("download")}
              </button>
            </div>
          </div>
        )}

        {data.files_numbers &&
          Array.from(Array(number), (e, i) => (
            <React.Fragment key={i}>
              {data[`research${i + 1}_image_word`] && (
                <div className="inputt-atch">
                  <h3>{t(`service${id}-step-two.word${i + 1}`)}</h3>
                  <div className="atch-btns">
                    <button
                      className="atch-btn-open"
                      onClick={() => {
                        openImage(
                          `${API_URL}/${User.national_id}/${data[`research${i + 1}_image_word`]
                          }`
                        );
                      }}
                      style={{ background: "#19355a" }}
                      class="atch-btn"
                    >
                      {t("open")}
                    </button>
                    <button
                      onClick={() => {
                        downloadImage(
                          `${API_URL}/${User.national_id}/${data[`research${i + 1}_image_word`]}`, `${data[`research${i + 1}_image_word`]}`
                        );
                      }}
                      style={{ background: "#AD8700" }}
                      class="atch-btn"
                    >
                      {t("download")}
                    </button>
                  </div>
                </div>
              )}
              {data[`research${i + 1}_image_pdf`] && (
                <div className="inputt-atch">
                  <h3>{t(`service${id}-step-two.pdf${i + 1}`)}</h3>
                  <div className="atch-btns">
                    <button
                      onClick={() => {
                        openImage(
                          `${API_URL}/${User.national_id}/${data[`research${i + 1}_image_pdf`]
                          }`
                        );
                      }}
                      style={{ background: "#19355a" }}
                      class="atch-btn"
                    >
                      {t("open")}
                    </button>
                    <button
                      onClick={() => {
                        downloadImage(
                          `${API_URL}/${User.national_id}/${data[`research${i + 1}_image_pdf`]}`, `${data[`research${i + 1}_image_pdf`]}`
                        );
                      }}
                      style={{ background: "#AD8700" }}
                      class="atch-btn"
                    >
                      {t("download")}
                    </button>
                  </div>
                </div>
              )}
              {data[`acceptance_letter${i + 1}`] && (
                <>
                  <div className="inputt-atch">
                    <h3>
                      {t(`service${id}-step-two.acceptance_letter${i + 1}`)}
                    </h3>
                    <div className="atch-btns">
                      <button
                        onClick={() => {
                          openImage(
                            `${API_URL}/${User.national_id}/${data[`acceptance_letter${i + 1}`]
                            }`
                          );
                        }}
                        style={{ background: "#19355a" }}
                        class="atch-btn"
                      >
                        {t("open")}
                      </button>
                      <button
                        onClick={() => {
                          downloadImage(
                            `${API_URL}/${User.national_id}/${data[`acceptance_letter${i + 1}`]}`, `${data[`acceptance_letter${i + 1}`]}`
                          );
                        }}
                        style={{ background: "#AD8700" }}
                        class="atch-btn"
                      >
                        {t("download")}
                      </button>
                    </div>
                  </div>
                  <div></div>
                </>
              )}
            </React.Fragment>
          ))}
      </div>

      <h1>{t("response")}</h1>
      <hr style={{ width: "100%" }} />
      {data.response_date && (data.status == 5 || data.status == 6 || data.status == 3) && (
        <h2>
          <span style={{ color: "#AD8700" }}>{t("date-response")} </span> :{" "}
          {data.response_date?.slice(0, 10)}
        </h2>
      )}
      {data.payment_code && (
        <h2>
          <span style={{ color: "#AD8700" }}>{t("res-code")}</span>:{" "}
          {data.payment_code}
        </h2>
      )}
      {(data.status == 5 || data.status == 6 || data.status == 3) && (
        <>
          {data.response_text && (
            <h2>
              <span style={{ color: "#AD8700" }}>{t("notes")}</span> :{" "}
              {data.response_text}
            </h2>
          )}
          <div
            className="inputt "
            style={{ gridTemplateColumns: "1fr", gridGap: "0px" }}
          >
            {data.response_pdf && (
              <div
                className="inputt-atch"
                style={{ justifyContent: "space-evenly" }}
              >
                <h2>{t("att-res")}</h2>
                <div className="atch-btns">
                  <button
                    className="atch-btn-open"
                    onClick={() => {
                      openImage(
                        `${API_URL}/${User.national_id}/${data.response_pdf}`
                      );
                    }}
                    style={{ background: "#19355a" }}
                    class="atch-btn"
                  >
                    {t("open")}
                  </button>
                  <button
                    onClick={() => {
                      downloadImage(
                        `${API_URL}/${User.national_id}/${data.response_pdf}`, `${data.response_pdf}`
                      );
                    }}
                    style={{ background: "#AD8700" }}
                    class="atch-btn"
                  >
                    {t("download")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Serinfo;
