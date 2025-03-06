import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../config";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  return <h1>{time.toLocaleTimeString()}</h1>;
}

const NavTop = () => {
  const navigate = useNavigate();
  const [manager, setManager] = useState([]);

  useEffect(() => {
    try {
      axios.defaults.withCredentials = true;
      axios
        .get(`${API_URL}/Fmanager/getMyInfo`, { withCredentials: true })
        .then((res) => {
          setManager(res.data);
        })
        .catch((error) => {
          if (error.response.status === 401 ) window.location.replace("/Library/ManagerLogin");
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const logout = () => {
    axios
      .get(`${API_URL}/authmanager/logout`, { withCredentials: true })
      .then((res) => {
        navigate("/Library/ManagerLogin");
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <div className=" dmin">
      <nav className="topnave mnav">
        <button onClick={logout} className="logOut">
          <Link style={{ color: "white", textDecoration: "none" }}>
            تسجيل الخروج
          </Link>
        </button>
        {/* <ul style={{ direction: "rtl" }}>
           {manager.role === 0 && (
            <>
              <li>
                <Link
                  onClick={() => setActive("all_active")}
                  className={active === "all_active" ? "active" : ""}
                  exact
                  to="/Library/manager/all"
                >
                  عرض جميع الطلبات
                </Link>
              </li>
            {+manager.service_id !== 9 && 
              <li>
              <Link
                onClick={() => setActive("CONTACT_active")}
                className={active === "CONTACT_active" ? "active" : ""}
                to="/Library/manager/contact"
              >
                الرسائل
              </Link>
            </li>
            }
              {+manager.service_id !== 9 && (
                <li>
                  <Link
                    onClick={() => setActive("home_active")}
                    className={active === "home_active" ? "active" : ""}
                    exact
                    to="/Library/manager/list"
                  >
                    توزيع الطلبات
                  </Link>
                </li>
              )}
            </>
          )}
          <li>
            <Link
              onClick={() => setActive("LIST_active")}
              className={active === "LIST_active" ? "active" : ""}
              to="/Library/manager/Review"
            >
              الطلبات الموزعة لك
            </Link>
          </li>
          {manager.role === 0 && manager.service_id !== 9 && (
            <li>
              <Link
                onClick={() => setActive("REVIWED_active")}
                className={active === "REVIWED_active" ? "active" : ""}
                to="/Library/manager/reviewed"
              >
                الطلبات التي تمت مراجعتها
              </Link>
            </li>
          )} 
            
        </ul> */}
        <Clock />

        <h1>{manager.mname} ( {manager.faculty_name_ar} )</h1>
      </nav>
    </div>
  );
};

export default NavTop;
