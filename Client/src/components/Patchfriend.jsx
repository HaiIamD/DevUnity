import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from '../state/index';
import '../scenes/homaPage/HomePage.css';
import Deletepost from './Deletepost';
import { FaUserCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Patchfriend({ userId, conn, id }) {
  const dispatch = useDispatch();

  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const patchFriend = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_USER_API}${_id}/${userId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.log({ message: error.message });
    }
  };

  return (
    <div>
      {conn === 'connection' ? (
        <button className="bg-transparent border-0 iconAddKecil" onClick={patchFriend}>
          {friends.find((friend) => friend._id === userId) ? <i className="bi bi-person-dash-fill"></i> : <i className="bi bi-person-plus-fill  "></i>}
        </button>
      ) : conn === userId ? (
        <Deletepost id={id} />
      ) : conn === 'hilangkan' ? (
        <i className="bi bi-person-circle text-white"></i>
      ) : userId === id ? (
        <Link to={'/edit'}>
          <FaUserCog size={25} className="lope" />
        </Link>
      ) : (
        <button className="btn btn-transparent border-0" onClick={patchFriend}>
          {friends.find((friend) => friend._id === userId) ? (
            <span className="bi bi-person-fill-dash rounded-3 bg-transparent follow ">
              {' '}
              <span className="noTextInput">Unfollow</span>
            </span>
          ) : (
            <span className="bi bi-person-plus-fill px-3 rounded-3 bg-transparent follow">
              {' '}
              <span className="noTextInput">Follow</span>
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default Patchfriend;
