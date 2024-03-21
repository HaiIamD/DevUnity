import React, { useState } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { setLogout } from '../../state/index';
import { useDispatch } from 'react-redux';
import { FaAlignJustify } from 'react-icons/fa';
import { FaSun } from 'react-icons/fa';
import { BsFillMoonStarsFill } from 'react-icons/bs';
import useLocalStorage from 'use-local-storage';
import { RiMessage3Fill } from 'react-icons/ri';

function Navbar({ handleChange, isChecked }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const [drop, setDrop] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage(true);
  const isLoginPage = location.pathname === '/';
  const isRegisterPage = location.pathname === '/register';

  if (isLoginPage || isRegisterPage) {
    return null;
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg p-3 Navbar">
        <div className="container-fluid d-flex justify-content-between ">
          <Link to={'/home'} className="TitleNavbar">
            D e v U n i t y .
          </Link>
          <div className="d-flex align-items-center">
            <div
              onClick={() => {
                handleChange();
                setDarkMode(!darkMode);
              }}
              checked={isChecked}
            >
              {darkMode ? (
                <div className="mx-3 pointer">
                  <BsFillMoonStarsFill size={19} color="#9400FF" />
                </div>
              ) : (
                <div className="mx-3 pointer">
                  <FaSun size={19} color="#FF8400" />
                </div>
              )}
            </div>

            <Link className="bi bi-github text-light mx-3 link"></Link>
            <a className="mx-3 link" href="/message">
              <RiMessage3Fill size={20} color="#FFFFFF " />
            </a>
            <Link className="bi bi-gear-fill text-light mx-3 link" to={'/edit'}></Link>
            <Link className="text-decoration-none rounded-3 ms-5 me-2 linkLogout" onClick={() => dispatch(setLogout())}>
              <span className="bi bi-door-closed"> logout</span>
            </Link>
            <div className="Dropdown" onClick={() => setDrop(!drop)}>
              <FaAlignJustify size={20} color="#ffff" />
            </div>
          </div>
        </div>
      </nav>

      <div className="row">
        <div className="buttonOff mt-1">
          <div className="col-6 transparent"></div>
          <div className={drop ? 'col-6 d-grid gaTransparent rounded-3 p-3' : 'gaTransparents'}>
            <a href="https://github.com/HaiIamD" target="_blank" className="bi bi-github links ">
              <span className="ms-2">Github</span>
            </a>
            <a href="/message" className="links">
              {' '}
              <RiMessage3Fill size={20} />
              <span className="ms-2">Message</span>
            </a>
            <a href="/edit" className="bi bi-gear-fill links" to={'/edit'}>
              <span className="ms-2">Edit</span>
            </a>
            <a className="text-decoration-none " onClick={() => dispatch(setLogout())}>
              <p className="bi bi-door-closed links">
                <span className="ms-2">Logout</span>
              </p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
