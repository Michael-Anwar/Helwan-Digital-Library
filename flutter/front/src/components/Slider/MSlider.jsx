import React, { useState, useEffect } from 'react';
import './slider.css';
import { BsFillBarChartFill } from "react-icons/bs";
import axios from 'axios';
import { API_URL } from '../../config';
import { useNavigate } from 'react-router-dom';

const MSlider = ({ activePage, onPageChange }) => {
  const navigate = useNavigate();
  const [isExpanded, setExpanded] = useState(localStorage.getItem('expanded_manager_slider') === "true" );
  const [manager, setManager] = useState([]);
  const [applicantsPerPage, setApplicantsPerPage] = useState(localStorage.getItem('applicantsPerPage'));
  const [active, setActive] = useState(localStorage.getItem('active_manager_slider') || "REVIEW_active");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpanded(false);
        localStorage.setItem('expanded_manager_slider', false);
      } 
      // else {
      //   setExpanded(true);
      //   localStorage.setItem('expanded_manager_slider', true);
      // }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    try {
      axios.defaults.withCredentials = true;
      axios
        .get(`${API_URL}/manager/getMyInfo`, { withCredentials: true })
        .then((res) => {
          setManager(res.data);
        })
        .catch((error) => {
          if (error.response.status === 401) window.location.replace("/Library/ManagerLogin");
          window.location.replace("/Library/ManagerLogin");
        });
    } catch (error) {
      console.log(error);
    }
  }, []);



  const handleSetActive = (item) => {
    setActive(item);
    localStorage.setItem('active_manager_slider', item);
  };

  const handleNavigate = (path, item) => {
    handleSetActive(item);
    navigate(path);
  }
  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setExpanded(newExpandedState);
    localStorage.setItem('expanded_manager_slider', newExpandedState);
  };

  return (
    <div className={isExpanded ? "side-nav-container" : "side-nav-container side-nav-container-NO"}>
      <div className="nav-upper" style={{ justifyContent: 'space-evenly' , justifyItems: 'center' }}>
        <div className="nav-heading">
          {isExpanded && (
            <div className="nav-logo" style={{ gap: '.8rem' }}>
              {/* <BsFillBarChartFill className='icon' /> */}
              <select
                style={{ fontSize: '.8rem' }}
                value={applicantsPerPage}
                onChange={(e) => {
                  setApplicantsPerPage(e.target.value);
                  localStorage.setItem('applicantsPerPage', e.target.value);
                  window.location.reload();
                }}
              >
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
              </select>
              <h3 style={{ fontSize: '.7rem' }}>
                عدد الطلبات في الصفحة
              </h3>
            </div>
          )}
          <button
            className={isExpanded ? "hamburger hamburger-in" : "hamburger hamburger-out"}
            onClick={() => toggleExpand()}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="charts">
          <div className='button-container'>
            {manager.role === 0 && (
              <>
                {manager.service_id == 9 ? (
                  // to code
                  <button
                    onClick={() => handleNavigate("/Library/manager/AllToCode", "all_active")}
                    className={active === "all_active" ? "active" : ""}>
                    عرض جميع الطلبات
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavigate("/Library/manager/all", "all_active")}
                    className={active === "all_active" ? "active" : ""}>
                    عرض جميع الطلبات
                  </button>
                )}

                <button
                  onClick={() => handleNavigate("/Library/manager/contact", "CONTACT_active")}
                  className={active === "CONTACT_active" ? "active" : ""}>
                  الرسائل
                </button>

                {+manager.service_id !== 9 && (
                  <>
                    <button
                      onClick={() => handleNavigate("/Library/manager/list", "LIST_active")}
                      className={active === "LIST_active" ? "active" : ""}>
                      توزيع الطلبات
                    </button>

                  </>
                )}
              </>
            )}

            <button
              onClick={() => handleNavigate("/Library/manager/Review", "REVIEW_active")}
              className={active === "REVIEW_active" ? "active" : ""}>
              الطلبات الموزعة لك
            </button>
            {manager.service_id !== 9 && (
              <button
                onClick={() => handleNavigate("/Library/manager/ReviewDone", "done_active")}
                className={active === "done_active" ? "active" : ""}>
                الطلبات المنتهية
              </button>
            )}

            <button
              onClick={() => handleNavigate("/Library/manager/AllApp", "AllApp_active")}
              className={active === "AllApp_active" ? "active" : ""}>
              كل الطلبات المرسلة
            </button>

            {manager.role === 0 && manager.service_id !== 9 && (
              <button
                onClick={() => handleNavigate("/Library/manager/reviewed", "REVIWED_active")}
                className={active === "REVIWED_active" ? "active" : ""}>
                الطلبات التي تمت مراجعتها
              </button>
            )}
          </div>
        </div>

      )}

    </div>
  );
};

export default MSlider;
