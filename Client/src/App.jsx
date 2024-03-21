import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './scenes/homaPage/HomePage';
import LoginPage from './scenes/loginPage/LoginPage';
import ProfilePage from './scenes/profilePage/ProfilePage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import RegisterPage from './scenes/loginPage/RegisterPage';
import state from './state';
import Editpage from './scenes/Editpage/Editpage';
import './index.css';
import useLocalStorage from 'use-local-storage';
import Navbar from './scenes/navbar/Navbar';
import Message from './scenes/Message/Message';

function App() {
  const [isDark, setIsDark] = useLocalStorage(true);
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <>
      <div className="app" data-theme={isDark ? 'dark' : 'light'}>
        <BrowserRouter>
          <Navbar isChecked={isDark} handleChange={() => setIsDark(!isDark)} />

          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/edit" element={isAuth ? <Editpage /> : <Navigate to="/" />} />
            <Route path="/message" element={isAuth ? <Message /> : <Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
