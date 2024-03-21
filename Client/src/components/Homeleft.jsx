import React, { useEffect, useState } from 'react';
import state, { setFriends } from '../state/index';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../scenes/homaPage/HomePage.css';

function Homeleft() {
  const dispatch = useDispatch();
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [user, setUser] = useState('');
  const friends = useSelector((state) => state.user.friends);

  const dataUser = async () => {
    try {
      const userApi = await fetch(`${import.meta.env.VITE_USER_API}${_id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const rincianUser = await userApi.json();
      setUser(rincianUser);
    } catch (error) {
      console.log({ massage: error.massage });
    }
  };
  const allFriends = async () => {
    try {
      const friendsApi = await fetch(`${import.meta.env.VITE_USER_API}${_id}/friends`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const allFriend = await friendsApi.json();

      dispatch(setFriends({ friends: allFriend }));
    } catch (error) {
      console.log({ massage: error.massage });
    }
  };

  useEffect(() => {
    dataUser();
    allFriends();
  }, []);

  const fullname = `${user.firstName} ${user.lastName}`;

  return (
    <>
      <div className=" d-grid justify-content-center h-left rounded-4 py-4 mt-4 px-2">
        <Link to={`/profile/${_id}`} className="d-flex justify-content-center ">
          <img src={`${import.meta.env.VITE_GAMBAR_API}${picturePath}`} alt="profile" className="object-fit-cover img-fluid gambarProfile" />
        </Link>
        <p className="judulProfile mb-1 mt-2">{fullname}</p>

        <span className="angka">
          <i className="bi bi-geo-alt-fill me-2"></i>: {user.location}
        </span>
        <span className="angka">
          <i className="bi bi-bag me-2"></i>: {user.occupation}
        </span>

        <span className="judulProfile mt-2">Your Friends</span>
        {friends.length === 0 ? (
          <div className="d-flex kotakTech text-center">
            <p className="noFriends rounded-3 p-2 col-12"> No friends yet ....</p>
          </div>
        ) : (
          <div className="d-flex kotakTech">
            {friends.map((friend, i) => (
              <Link to={`/profile/${friend._id}`} key={i}>
                <img src={`${import.meta.env.VITE_GAMBAR_API}${friend.picturePath}`} alt="" className="object-fit-cover iconConnection col-2 ms-2" />
              </Link>
            ))}
          </div>
        )}

        <div className=" px-2 ">
          <div className="d-flex justify-content-between viewed">
            <span className="isiProfile">Who's viewed your profile </span>
            <span className="angka">{user.viewedProfile}</span>
          </div>
          <div className="d-flex justify-content-between viewed">
            <span className="isiProfile">Impression of your post </span>
            <span className="angka">{user.impressions}</span>
          </div>
        </div>
        <hr className="hr" />
        <span className="judulProfile">Social Profile</span>
        <div className="d-flex justify-content-center ">
          <a href={`mailto:${user.email}`} className="d-flex text-decoration-none mx-3 text-white align-items-center">
            <img src="../assets/google.png" alt="" className="iconTech img-fluid " />
            <span style={{ minWidth: '80px' }} className="ms-1 textIconSosial">
              Gmail
            </span>
          </a>
          <a href={user.github} target="_blank" className="d-flex text-decoration-none mx-3 text-white align-items-center">
            <img src="../assets/github.png" alt="" className="iconTech img-fluid " />
            <span style={{ minWidth: '80px' }} className="ms-1 textIconSosial">
              Github
            </span>
          </a>
        </div>
        <div className="d-flex justify-content-center ">
          <a href={user.instagram} target="_blank" className="d-flex text-decoration-none mx-3 text-white align-items-center">
            <img src="../assets/instagram.png" alt="" className="iconTech img-fluid " />
            <span style={{ minWidth: '80px' }} className="ms-1 textIconSosial">
              Instagram
            </span>
          </a>
          <a href={user.linkedin} target="_blank" className="d-flex text-decoration-none mx-3 text-white align-items-center">
            <img src="../assets/linkedin.png" alt="" className="iconTech img-fluid " />
            <span style={{ minWidth: '80px' }} className="ms-1 textIconSosial">
              LinkedIn
            </span>
          </a>
        </div>
      </div>
    </>
  );
}

export default Homeleft;
