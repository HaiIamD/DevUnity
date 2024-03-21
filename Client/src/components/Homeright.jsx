import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../scenes/homaPage/HomePage.css';
import Patchfriend from './Patchfriend';

function Homeright() {
  const { _id } = useSelector((state) => state.user);

  const token = useSelector((state) => state.token);
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState('');

  const getFriends = async () => {
    let url = `${import.meta.env.VITE_USER_API}`;

    if (selected) {
      url += `?firstName=${selected}`;
    }
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const posts = data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setFriends(posts);
    } catch (error) {
      console.log({ message: error.message });
    }
  };

  useEffect(() => {
    getFriends();
  }, [selected]);

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      setSelected(e.target.value);
    }
  };
  return (
    <>
      <div className="col-12 p-3 py-4  mt-4 rounded-4 text-center newsBox">
        <p className="newsTitle">Information</p>
        <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="../assets/3.gif" className="object-fit-cover img-fluid d-block w-100" style={{ maxHeight: '11rem' }} />
            </div>
            <div className="carousel-item">
              <img src="../assets/1.gif" className="object-fit-cover img-fluid d-block w-100" style={{ maxHeight: '11rem' }} />
            </div>
            <div className="carousel-item">
              <img src="../assets/2.gif" className="object-fit-cover img-fluid d-block w-100" style={{ maxHeight: '11rem' }} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 p-3 py-4  mt-4 rounded-4 text-center newsBox">
        <p className="newsTitle">All User</p>
        <input type="text" placeholder="Search connection ..." className=" col-10 rounded-4 p-2 mb-2 searchConnectionInput" onKeyDown={handleEnterPress} />
        <div className="connection">
          {friends.map((friend, i) => (
            <div className="d-flex justify-content-between align-items-center px-2 m-1 my-2" key={i}>
              <div className="d-flex">
                <Link to={`/profile/${friend._id}`}>
                  <img src={`${import.meta.env.VITE_GAMBAR_API}${friend.picturePath}`} alt="" className="object-fit-cover iconConnection col-2" />
                </Link>
                <div className="d-grid mx-3 namaCoennction">
                  <span className="titleNamaConnection">
                    {friend.firstName} {friend.lastName}
                  </span>
                  <span className="text-white-50">{friend.occupation}</span>
                </div>
              </div>
              <Patchfriend userId={friend._id} conn={friend._id === _id ? 'hilangkan' : 'connection'} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Homeright;
