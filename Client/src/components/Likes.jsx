import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../state/index';

function PatchLikes({ idPost, likes }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const patchlike = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_POST_NEW}/${idPost}/like`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: loggedInUserId }),
      });

      const updatedPost = await response.json();

      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.log({ message: error.message });
    }
  };

  return (
    <div>
      <div className=" d-flex align-items-center border-0">
        {isLiked ? (
          <i className="bi bi-heart-fill   ms-1  btn border-0 text-danger" onClick={() => patchlike()}></i>
        ) : (
          <i className="bi bi-heart-fill ms-1 btn border-0 lope" onClick={() => patchlike()}></i>
        )}
        <span className="lope">{likeCount}</span>
      </div>
    </div>
  );
}

export default PatchLikes;
