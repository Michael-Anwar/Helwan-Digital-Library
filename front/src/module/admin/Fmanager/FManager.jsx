import React, { useState } from 'react';
import NavTop from './Nav/NavTop';
import { Outlet } from 'react-router-dom';


const FManager = () => {
  // State to manage the active page or slide
  

  return (
    <div style={{ overflow: 'hidden' , height: '100vh' }} >
      <NavTop />
      <div className="chart-Grid" style={{ height: '100%' }}>
        {/* Pass activePage and handlePageChange as props to the Slider component */}
        {/* <Slider/> */}
        {/* {activePage === 0 && <AllToCode />}
        {activePage === 1 && <All />}
        {activePage === 2 && <Contact />}
        {activePage === 3 && <StudentListadmin />}
        {activePage === 4 && <Review />}
        {activePage === 5 && <AllApp />}
        {activePage === 6 && <Reviewed />} */}
        <div style={{ width: '100%', overflow: 'auto' }}>
        <Outlet />
        </div>

      </div>
    </div>
  );
};

export default FManager;
