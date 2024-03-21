import React, { useState } from 'react';
import './Editpage.css';

import { useDispatch, useSelector } from 'react-redux';
import { FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { setLogin } from '../../state/index';
import { Link, useNavigate } from 'react-router-dom';

function Editpage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [firstName, setFirstName] = useState(`${user.firstName}`);
  const [lastName, setLastName] = useState(`${user.lastName}`);
  const [picturePath, setPicturePath] = useState('');
  const [occupation, setOccupation] = useState(`${user.occupation}`);
  const [location, setLocation] = useState(`${user.location}`);
  const [description, setdescription] = useState(`${user.description}`);
  const [linkedIn, setLinkedin] = useState(`${user.linkedin}`);
  const [instagram, setInstagram] = useState(`${user.instagram}`);
  const [gmail, setGmail] = useState(`${user.gmail}`);
  const [github, setGithub] = useState(`${user.github}`);
  const [gambar, setGambar] = useState(`${import.meta.env.VITE_GAMBAR_API}${user.picturePath}`);

  const submitDataRegister = async (e) => {
    e.preventDefault();
    const registerData = new FormData();
    registerData.append('id', user._id);
    registerData.append('firstName', firstName);
    registerData.append('lastName', lastName);
    registerData.append('picturePath', picturePath);
    registerData.append('occupation', occupation);
    registerData.append('location', location);
    registerData.append('description', description);
    registerData.append('linkedin', linkedIn);
    registerData.append('instagram', instagram);
    registerData.append('gmail', gmail);
    registerData.append('github', github);

    try {
      const registerApi = await fetch(`${import.meta.env.VITE_USER_API}updateUser`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: registerData,
      });

      if (registerApi.status === 200) {
        const hasilUpdate = await registerApi.json();

        alert('Success Change Personal information');
        navigate('/home');
        dispatch(
          setLogin({
            user: hasilUpdate,
            token: token,
          })
        );
      } else {
        console.error('Update failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const gambarbaru = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGambar(URL.createObjectURL(e.target.files[0]));
      setPicturePath(e.target.files[0]);
    }
  };
  return (
    <>
      <div className="editPage d-flex justify-items-center ">
        <div className="row col-12 ">
          <div className="justify-content-center ngaturEdit">
            <div className="col-12 col-xl-3 rounded-4 leftEdit text-center  mx-2 my-3 mb-5  p-5">
              <Link to={`/profile/${user._id} `} className="flex">
                <img src={gambar} className="object-fit-cover  img-fluid gambarProfile" />
              </Link>
              <div className="d-flex justify-content-center mt-3">
                <div className="Name col-6 p-2 rounded-2 ">
                  <span>{firstName}</span>
                </div>
                <div className="Name col-6 p-2 rounded-2 ms-1 ">
                  <span>{lastName}</span>
                </div>
              </div>
              <div className="col-12 mt-3 p-2 rounded-2 Name">{occupation}</div>
              <div className="col-12 mt-3 p-2 rounded-2 Name">{location}</div>
              <div className="col-12 mt-3 p-2 rounded-2 desc ">{description}</div>
              <div className="col-12 mt-3 p-2 rounded-2 Name">{linkedIn}</div>
              <div className="col-12 mt-3 p-2 rounded-2 Name">{github}</div>
              <div className="col-12 mt-3 p-2 rounded-2 Name">{instagram}</div>
              <div className="col-12 mt-3 p-2 rounded-2 Name">{gmail}</div>
            </div>
            <div className="col-12 col-xl-7 mx-2 my-3 ms-2 mb-5 p-5 d-flex align-items-center justify-content-center rounded-4 rightEdit">
              <form onSubmit={submitDataRegister}>
                <p className="form-label text-center editSession">Personal Information</p>
                <div className="d-flex justify-content-between">
                  <div className="col-6">
                    <div className="mb-2">
                      <label htmlFor="firstName" className="form-label  emailpasswordedit">
                        FistName
                      </label>
                      <input
                        type="text"
                        className="form-control py-1 border-2 input"
                        id="firstName"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-5">
                    <div className="mb-2">
                      <label htmlFor="lastName" className="form-label  emailpasswordedit">
                        LastName
                      </label>
                      <input
                        type="text "
                        className="form-control py-1 border-2 input"
                        id="lastName"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <label htmlFor="picture" className="form-label emailpasswordedit cursor-pointer ">
                    Picture
                  </label>
                  <input
                    type="file"
                    accept="image/gif, image/jpeg, image/png,image/jpg"
                    className="form-control py-1 border-2 input"
                    id="picture1"
                    onChange={gambarbaru}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="occupation" className="form-label  emailpasswordedit">
                    Occupation
                  </label>
                  <input
                    type="text"
                    className="form-control py-1 border-2 input"
                    id="occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="location" className="form-label  emailpasswordedit ">
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control py-1 border-2 input"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="description" className="form-label  emailpasswordedit">
                    Description
                  </label>
                  <textarea
                    cols={4}
                    rows={4}
                    type="text"
                    className="form-control py-1 border-2 text-area input"
                    id="description"
                    value={description}
                    onChange={(e) => setdescription(e.target.value)}
                  />
                </div>
                <p className="form-label text-center editSession my-3">Social Media</p>
                <div className="col-12 d-flex justify-content-between">
                  <div className="col-5 d-flex align-items-center">
                    <FaLinkedin size={30} color="#ffff" />
                    <input
                      placeholder="LinkedIn"
                      type="text"
                      className="form-control ms-2 border-2 input"
                      id="linkedIn"
                      value={linkedIn}
                      onChange={(e) => setLinkedin(e.target.value)}
                    />
                  </div>
                  <div className="col-5 d-flex align-items-center">
                    <FaGithub size={30} color="#ffff" />
                    <input
                      placeholder="Github"
                      type="text"
                      className="form-control ms-2 border-2 input"
                      id="github"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-between mt-3">
                  <div className="col-5 d-flex align-items-center">
                    <FaInstagram size={30} color="#ffff" />
                    <input
                      placeholder="Instagram"
                      type="text"
                      className="form-control ms-2 border-2 input"
                      id="instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                    />
                  </div>
                  <div className="col-5 d-flex align-items-center">
                    <SiGmail size={30} color="#ffff" />
                    <input
                      placeholder="Gmail"
                      type="text"
                      className="form-control ms-2 border-2 input"
                      id="gmail"
                      value={gmail}
                      onChange={(e) => setGmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="text-end mt-4">
                  <button type="submit" className="btn px-5 py-1 submitButton col-12">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Editpage;
