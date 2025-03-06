import React, { useState } from 'react';
import NavTop from './Nav/NavTop';
import Slider from '../../../components/Slider/MSlider';
import { Outlet } from 'react-router-dom';
import AllToCode from './all/AllToCode';
import All from './all/All';
import Contact from './contact/Contact';
import StudentListadmin from './studentList/StudentList';
import Review from './review/Review';
import AllApp from './all/AllApp';
import Reviewed from './reviewed/Reviewed';

const Manager = () => {
  // State to manage the active page or slide
  

  return (
    <div style={{ overflow: 'hidden' , height: '100vh' }} >
      <NavTop />
      <div className="chart-Grid" style={{ height: '100%' }}>
        <Slider/>
        <div style={{ width: '100%', overflow: 'auto' }}>
        <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Manager;
