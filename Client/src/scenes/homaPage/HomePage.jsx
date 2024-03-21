import React, { useEffect, useState } from 'react';

import './HomePage.css';

import Homeleft from '../../components/Homeleft';
import Homemiddle from '../../components/Homemiddle';
import Homeright from '../../components/Homeright';

function HomePage() {
  return (
    <>
      <div className="container-fluid homePage">
        <div className="row d-flex justify-content-center">
          {/* LeftSIde */}
          <div className="col-0 col-md-5 col-xxl-3 d-grid k-left">
            <Homeleft />
          </div>
          <div className="col-12 col-md-7 col-xxl-7">
            <Homemiddle />
          </div>
          <div className="col-0 col-md-0 col-xxl-2 k-right">
            <Homeright />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
