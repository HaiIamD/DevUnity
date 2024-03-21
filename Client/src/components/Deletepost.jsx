import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../scenes/homaPage/HomePage.css';

import { setPosts } from '../state/index';
import { useNavigate } from 'react-router-dom';

function Deletepost({ id }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const deletePostingan = async () => {
    try {
      const deleteAPI = await fetch(`${import.meta.env.VITE_POST_NEW}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const posts = await deleteAPI.json();
      if (deleteAPI.ok) {
        dispatch(setPosts({ posts }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="dropdown">
        <button className="btn btnPostDelete" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i className="bi bi-three-dots-vertical"></i>
        </button>
        <ul className="dropdown-menu dropDown">
          <a className="dropdown-item textDelete" style={{ cursor: 'pointer' }} onClick={deletePostingan}>
            Delete
          </a>
        </ul>
      </div>
    </>
  );
}

export default Deletepost;
