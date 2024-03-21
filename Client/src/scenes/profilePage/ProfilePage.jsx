import React, { useEffect, useState } from 'react';

import './ProfilePage.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../state/index';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import Patchfriend from '../../components/Patchfriend';
import Commentar from '../../components/Commentar';

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState('');
  const token = useSelector((state) => state.token);
  const { userId } = useParams();
  const [dataTeman, setDataTeman] = useState([]);
  const { _id } = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const [allConverstation, setAllConverstation] = useState([]);
  // console.log(posts);
  const dataprofiel = async () => {
    try {
      const userProfil = await fetch(`${import.meta.env.VITE_USER_API}${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const dataProfile = await userProfil.json();

      setProfile(dataProfile);
    } catch (error) {
      console.log({ message: error.message });
    }
  };

  const getFriends = async () => {
    const response = await fetch(`${import.meta.env.VITE_USER_API}${userId}/friends`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setDataTeman(data);
  };

  const getPost = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_POST_NEW}/${userId}/posts`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      // console.log(sortedPosts);
      // setPostPribadi(sortedPosts);

      dispatch(setPosts({ posts: sortedPosts }));
    } catch (error) {
      console.log(error);
    }
  };

  const buatConverstation = async () => {
    try {
      const newConverstation = await fetch(`${import.meta.env.VITE_MESSAGE_NEW}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: _id,
          receiverId: userId,
        }),
      });

      if (newConverstation.ok) {
        navigate('/message');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllConverstaion = async () => {
    try {
      const allConverstationAPI = await fetch(`${import.meta.env.VITE_MESSAGE_NEW}/${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await allConverstationAPI.json();

      setAllConverstation(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dataprofiel();
    window.scrollTo(0, 0);
    getFriends();
    getPost();
    getAllConverstaion();
  }, []);
  const imageUrl = profile && profile.picturePath ? `${import.meta.env.VITE_GAMBAR_API}${profile.picturePath}` : '';
  const fullname = `${profile.firstName} ${profile.lastName}`;
  return (
    <>
      <div className="profilePage p-3">
        <div className="container ">
          <div className="row rowAtas  p-5">
            <div className="col-12 col-lg-3 rowAtasKiri">
              <img src={imageUrl} alt=" Profile page " className="object-fit-cover img-fluid gambarProfilePage" />
            </div>
            <div className="col-12 col-lg-8 rowAtasKanan">
              <div className="namaFollow mb-2">
                <div className="d-grid">
                  <span className="titleProfilePage">{fullname}</span>
                  <span className="angka ms-1">{profile.occupation}</span>
                </div>
                <div className="rounded-3 p-1 px-3 followUnfollow">
                  <Patchfriend userId={profile._id} id={_id} />
                </div>
              </div>
              <div className="descProfilePage px-4 py-2 rounded-4">
                {profile.description === '' ? (
                  <div className="d-flex justify-content-center descProfilePage align-items-center">
                    <span>No Description yet ...</span>
                  </div>
                ) : (
                  profile.description
                )}
              </div>
              <hr className="hr" />
              <div className="techAndAdders">
                <div>
                  <span className="titleProfilePage mt-4">Social Media</span>
                  <div className="d-flex flex-wrap justify-content-center ">
                    <a href={`mailto:${profile.email}`} className="d-flex text-decoration-none text-white align-items-center m-2">
                      <img src="../assets/google.png" alt="" className="iconTech img-fluid " />
                      <span style={{ minWidth: '80px' }} className="ms-2 textIconSosial">
                        Gmail
                      </span>
                    </a>{' '}
                    <a href={profile.instagram} target="_blank" className="d-flex text-decoration-none text-white align-items-center m-2">
                      <img src="../assets/instagram.png" alt="" className="iconTech img-fluid " />
                      <span style={{ minWidth: '80px' }} className="ms-2 textIconSosial">
                        Instagram
                      </span>
                    </a>
                    <a href={profile.github} target="_blank" className="d-flex text-decoration-none text-white align-items-center m-2">
                      <img src="../assets/github.png" alt="" className="iconTech img-fluid " />
                      <span style={{ minWidth: '80px' }} className="ms-2 textIconSosial">
                        Github
                      </span>
                    </a>
                    <a href={profile.linkedin} target="_blank" className="d-flex text-decoration-none text-white align-items-center m-2">
                      <img src="../assets/linkedin.png" alt="" className="iconTech img-fluid " />
                      <span style={{ minWidth: '80px' }} className="ms-2 textIconSosial">
                        LinkedIn
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row rowBawah">
            <div className="col-0 col-lg-3  rowBawahKiri">
              <div className="col-12 p-3 py-4  mt-4 rounded-4 text-center newsBox">
                <p className="newsTitles">{fullname} Friends</p>
                <hr />
                <div className="connection px-3">
                  {dataTeman.map((data, i) => (
                    <div className="d-flex justify-content-between align-items-center m-1 my-2" key={i}>
                      <div className="d-flex">
                        <a href={`/profile/${data._id}`}>
                          <img src={`${import.meta.env.VITE_GAMBAR_API}${data.picturePath}`} alt="" className="iconConnection col-2" />
                        </a>
                        <div className="d-grid m-2 namaCoennction">
                          <span className="titleNamaConnection">
                            {data.firstName}
                            {data.lastName}
                          </span>
                          <span>{data.occupation}</span>
                        </div>
                      </div>
                      <Patchfriend conn="connection" userId={data._id} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-9">
              {' '}
              <div className=" mt-4 d-flex flex-wrap justify-content-center">
                {/* Search Bar */}
                <div className="col-11 rounded-4 inputSection">
                  <div className="d-flex justify-content-center mt-2">
                    {allConverstation.length !== 0 ? (
                      <div className="col-12 mx-1 p-2 py-3 rounded-5 toMessage text-center">
                        {profile.firstName} {profile.lastName} Post
                      </div>
                    ) : (
                      <div className="btn col-12 mx-1 p-2 py-3 rounded-5 toMessage text-center" onClick={buatConverstation}>
                        Click here to Chat with {profile.firstName} {profile.lastName} ...
                      </div>
                    )}
                  </div>
                  <div className="col-12 rounded-4 isiPost p-4 py-5 my-3">
                    {posts.length === 0 ? (
                      <div className="d-grid justify-content-center text-center">
                        <img src="../assets/nofound.png" alt="noFound" className="img-fluid" />
                        <p className="noFound">No Post Yet 😿</p>
                      </div>
                    ) : (
                      posts.map((data, i) => (
                        <div className="p-3 border rounded-4 mb-3 p-4" key={i}>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <img src={`${import.meta.env.VITE_GAMBAR_API}${data.userPicturePath}`} alt="" className="iconPost col-2" />
                              <div className="d-grid p-3 namaUserPost">
                                <span>
                                  {data.firstName} {data.lastName}
                                </span>
                                <span>{moment(data.createdAt).fromNow()}</span>
                              </div>
                            </div>
                            <Patchfriend userId={data.userId} conn={_id} id={data._id} />
                          </div>
                          <p className="text-justify textPost">{data.description}</p>
                          <div className="d-grid justify-content-center">
                            {data.picturePath.toLowerCase().endsWith('.mp4') ? (
                              <video src={`${import.meta.env.VITE_GAMBAR_API}${data.picturePath}`} controls className="ratio ratio-16x9 rounded-4" />
                            ) : (
                              <img
                                src={`${import.meta.env.VITE_GAMBAR_API}${data.picturePath}`}
                                alt=""
                                className="img-fluid rounded-4"
                                style={{ maxHeight: '800px' }}
                              />
                            )}
                          </div>
                          <Commentar postId={data._id} likes={data.likes} comments={data.comments} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
