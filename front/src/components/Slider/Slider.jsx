import React, { useState, useEffect } from 'react';
import './slider.css'
import { BsFillBarChartFill } from "react-icons/bs"
import axios from 'axios'
import { API_URL } from '../../config';


const Slider = ({ filter, setfilter }) => {

  const [isExpanded, setExpanded] = useState(true)
  const [services, setServices] = useState({});
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpanded(false)
      } // Adjust the breakpoint as needed
    };

    handleResize(); // Check initial width

    window.addEventListener('resize', handleResize); // Add event listener for window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup the event listener
    };
  }, []);
  useEffect(() => {

    axios.defaults.withCredentials = true
    try {
      axios.get(`${API_URL}/user/getAllServices`, { withCredentials: true })
        .then((res) => {
          setServices(res.data)
        })
        .catch((err) => {

        })
    } catch (err) {
    }
  }, [])

  console.log(filter)
  console.log(services)


  return (

    <div className={isExpanded ? "side-nav-container" : "side-nav-container side-nav-container-NO"}>
      <div className="nav-upper">

        <div className="nav-heading">
          {isExpanded && (
            <div className="nav-logo">
              < BsFillBarChartFill className='icon' />
              <h2>الخدمات</h2>
            </div>
          )}
          <button
            className={isExpanded ? "hamburger hamburger-in" : "hamburger hamburger-out"}
            onClick={() => { setExpanded(!isExpanded) }}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="charts">
          <ul>
            <li onClick={() => {
              setfilter(null)
            }}>

              الكل

            </li>
            {Array.isArray(services) && services.map((service, index) => {
              if (index >= 8) {
                return null; // Skip rendering for index >= 5
              }
              return (
                <li
                  key={service.id}
                  onClick={() => {
                    setfilter(service.id)
                  }}
                >{service.service_name_ar}</li>
              )
            })}
          </ul>


        </div>
      )}
    </div>
  )
}

export default Slider