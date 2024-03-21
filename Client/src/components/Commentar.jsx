import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../state/index';
import '../scenes/homaPage/HomePage.css';
import state from '../state/index';
import PatchLikes from './Likes';

function Commentar({ postId, likes, comments }) {
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const [nampilinComentar, setNampilinComentar] = useState(false);
  const [comment, setComment] = useState('');
  const { _id, picturePath } = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);

  const kirimKomentar = async ({ postId }) => {
    try {
      const commentarSchema = await fetch(`${import.meta.env.VITE_POST_NEW}/comments`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          comment: comment,
        }),
      });

      const updatedPost = await commentarSchema.json();

      // Update state dengan post yang telah diperbarui
      dispatch(
        setPosts({
          posts: posts.map((post) => (post._id === postId ? { ...post, comments: updatedPost.comments } : post)),
        })
      );

      // Reset nilai komentar setelah berhasil dikirim
      setComment('');
    } catch (error) {
      console.log('gagal Menambah komentar');
    }
  };
  return (
    <>
      <div className="d-flex m-2">
        <PatchLikes idPost={postId} likes={likes} />
        <div className="d-flex align-items-center ms-4">
          <i className="bi bi-chat-left-text lope" onClick={() => setNampilinComentar((prevState) => (prevState === postId ? false : postId))}></i>
          <span className="ms-3 lope">{comments.length}</span>
        </div>
      </div>
      {nampilinComentar === postId && (
        <div>
          {comments.map((data, i) => (
            <div className="d-grid ms-4 " key={`${i}`}>
              <span className="textPost">{data}</span>
              <hr className="hr" />
            </div>
          ))}

          <div className="row">
            <form
              className="col-12"
              onSubmit={(e) => {
                e.preventDefault();
                kirimKomentar({ postId: postId });
              }}
            >
              <div className="d-flex  justify-content-center">
                <img src={`${import.meta.env.VITE_GAMBAR_API}${picturePath}`} alt="" className="object-fit-cover img-fluid iconcomments" />
                <input type="text" className="inputanCommnets p-2 col-9" value={comment} onChange={(e) => setComment(e.target.value)} />
                <button type="submit" className="ms-3 border-0 bg-transparent ">
                  <i className="bi bi-arrow-up-circle-fill postComment"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Commentar;
