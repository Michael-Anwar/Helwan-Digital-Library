import React from 'react';
import './PopupError.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URL } from "../../config";
import PopupErrorMsg from './PopupErrorMsg';


const PopupAddEvent = ({ event, setEvent, onClose }) => {


  const [t] = useTranslation();
  const [error, setError] = useState();



  const addEvent = () => {
    if (event.title.length == 0) {
      setError("من فضلك ادخل عنوان الخبر");
    } else if (event.content.length == 0) {
      setError("من فضلك ادخل محتوى الخبر");
    } else if (event.from.length == 0) {
      setError("من فضلك ادخل تاريخ البدايه");
    } else if (event.to.length == 0) {
      setError("من فضلك ادخل تاريخ النهايه");
    } else if (event.place.length == 0) {
      setError("من فضلك ادخل مكان الحدث");
    } else if (event.image.length == 0) {
      setError("من فضلك ادخل صوره الخبر");
    } else if (event.from.length > 0 && event.to.length > 0 && event.to < event.from) {
      setError("التاريخ غير صحيح");
    } else {
      axios.defaults.withCredentials = true;
      try {
        const formData = new FormData();
        formData.append('title', event.title);
        formData.append('content', event.content);
        formData.append('image', event.image);
        formData.append('from_date', event.from);
        formData.append('to_date', event.to);
        formData.append('place', event.place);
        axios
          .post(`${API_URL}/admin/addEvent`, formData, {
            withCredentials: true,
          })
          .then((res) => {
            onClose();
            window.location.reload();
          })
          .catch((err) => {
            if (err.response.status == 401)
              window.location.href = "/library/adminLogin";
          });
      } catch (err) {
        // console.log(err);
      }
    }

  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // setEvent({ ...event, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setError("");
  }

  return (
    <div className="popup-error">
      {error && <PopupErrorMsg message={error} onClose={handleClose} />}
      <div className="popup-error-content" style={{ width: '50%' }}>
        <div className="popup-error-message">
          <h3 className="table-title-h2"> اضافه موظف </h3>
          <div className="add-event">
            <input
              style={{ fontSize: "1.5rem" }}
              id="add-p"
              onChange={(e) => {
                setEvent({ ...event, title: e.target.value });
              }}
              type="text"
              placeholder="عنوان الخبر"
            />
            <input
              style={{ fontSize: "1.5rem" }}
              id="add-p"
              onChange={(e) => {
                setEvent({ ...event, content: e.target.value });
              }}
              type="email"
              placeholder="محتوى الخبر"
            />
            <div>
              <p>
                من
              </p>
              <input
                style={{ fontSize: "1.5rem" }}
                id="add-p"
                type="date"
                onChange={(e) => {
                  setEvent({ ...event, from: e.target.value });
                }}
                placeholder="من"
              />
            </div>
            <div>
              <p>
                الي
              </p>
              <input
                style={{ fontSize: "1.5rem" }}
                id="add-p"
                type="date"
                onChange={(e) => {
                  setEvent({ ...event, to: e.target.value });
                }}
                placeholder="الي"
              />
            </div>
            <input
              style={{ fontSize: "1.5rem" }}
              id="add-p"
              onChange={(e) => {
                setEvent({ ...event, place: e.target.value });
              }}
              type="text"
              placeholder="المكان"
            />

            <input
              type="file"
              onChange={(e) => {
                handleImageChange(e);
                setEvent({ ...event, image: e.target.files[0] });
              }}
              accept="image/*" />



          </div>
          {(event.from.length > 0 && event.to.length > 0) && (event.to < event.from) ? <p style={{ color: 'red' }}>التاريخ غير صحيح</p> : null}

          {selectedImage && (
            <div>
              {/* <h2>Selected Image:</h2> */}
              <img src={selectedImage} alt="Selected" style={{ width: '20%' }} />
            </div>
          )}
        </div>
        <div className="popup-error-close" onClick={onClose}>
          &#10006;
        </div>
        <button className="popup-login-button" onClick={addEvent} style={{ width: '100%' }}>
          اضافه الخبر
        </button>
      </div>
    </div>
  );
};

export default PopupAddEvent;