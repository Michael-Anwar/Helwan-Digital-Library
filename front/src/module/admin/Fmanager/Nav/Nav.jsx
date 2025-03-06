import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../config";


const Nav = () => {
  const navigate = useNavigate();
  const [manager, setManager] = useState([]);

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
  const [active, setActive] = useState("LIST_active");

  return (
    <div className="dmin">
      <nav className="mnav">
        <ul style={{ direction: "rtl" }}>
          {manager.role == 0 && (
            <>
              <li>
                {manager.service_id !== 9 ? (
                <Link
                  onClick={() => setActive("all_active")}
                  className={active === "all_active" ? "active" : ""}
                  exact
                  to="/Library/manager/all"
                >
                  عرض جميع الطلبات
                </Link>
                ) : (
                  <Link
                  onClick={() => setActive("all_active")}
                  className={active === "all_active" ? "active" : ""}
                  exact
                  to="/Library/manager/AllToCode"
                >
                  عرض جميع الطلبات
                </Link>
                )}
              </li>

              <li>
              <Link
                onClick={() => setActive("CONTACT_active")}
                className={active === "CONTACT_active" ? "active" : ""}
                to="/Library/manager/contact"
              >
                الرسائل
              </Link>
            </li>
            
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
          <li>
            <Link
              onClick={() => setActive("AllApp_active")}
              className={active === "AllApp_active" ? "active" : ""}
              to="/Library/manager/AllApp"
            >
              كل الطلبات المرسلة
            </Link>
          </li>

          {manager.role == 0 && manager.service_id != 9 && (
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
            
        </ul>

      </nav>
    </div>
  );
};

export default Nav;
