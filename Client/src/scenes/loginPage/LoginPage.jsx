import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../state/index';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submitLoginData = async (e) => {
    e.preventDefault();
    try {
      const loginApi = await fetch(`${import.meta.env.VITE_URL_LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (loginApi.ok) {
        const loggedIn = await loginApi.json();
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate('/home');
      } else {
        const loggedIn = await loginApi.json();
        setError(loggedIn.msg);
      }
    } catch (error) {
      console.log('Gagal Login');
      console.log(error);
    }
  };
  return (
    <>
      <div className="container-fluid l-left">
        <div className="row">
          <div className="col-12 col-xl-4 vh-100 d-flex align-items-center justify-content-center ">
            <div className="col-11 col-xl-10">
              <h1 className="mb-5 titleLogin">DevUnity</h1>

              <form onSubmit={submitLoginData}>
                <div className="mb-3 ">
                  <label htmlFor="email" className="form-label emailpasswords">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control py-2 border-2 "
                    id="email"
                    aria-describedby="emailHelp"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div id="emailHelp" className="form-text emailpasswords">
                    We'll never share your email with anyone else.
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label  emailpasswords">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control py-2 border-2"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error !== null && <p className="bg-danger p-3 text-center ">{error}</p>}
                <div className="text-end mt-4">
                  <button type="submit" className="btn px-5 py-2 submit">
                    Login
                  </button>
                </div>
              </form>
              <p className="text-center mt-3 toRegister">
                No account yet?{' '}
                <Link to={'/register'} className=" linkToRegister">
                  {' '}
                  Sign up here.
                </Link>
              </p>
            </div>
          </div>
          <div className="col-0 col-xl-8 d-flex align-items-center justify-content-center l-right">
            <div className=" d-flex align-items-center justify-content-center ">
              <img src="assets/login.png" className="img-fluid" alt="GambarLogin" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
