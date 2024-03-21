import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../scenes/homaPage/HomePage.css';
import { useDispatch } from 'react-redux';
import { setPosts } from '../state/index';
import moment from 'moment';
import Patchfriend from './Patchfriend';
import { MdOutlineClose } from 'react-icons/md';
import Commentar from './Commentar';

function Homemiddle() {
  const dispatch = useDispatch();
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [global, setGlobal] = useState(false);

  //   Ngambil dari from untuk POST DATA
  const [previewGambar, setPreviewGambar] = useState('');
  const [previewVideo, setPreviewVideo] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicturePath] = useState('');
  const [selected, setSelected] = useState('');
  const [teman, setTeman] = useState('global');
  const [isLoading, setIsLoading] = useState(true);

  //   Untuk Menampilkan seleuruh DATA POST
  const post = useSelector((state) => state.posts);

  // Urutkan data berdasarkan createdAt
  const posts = post.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  //   PostData
  const postData = async (e) => {
    e.preventDefault();

    const postAdd = new FormData();
    postAdd.append('userId', _id);
    postAdd.append('description', description);
    postAdd.append('picturePath', picture);

    try {
      const postSchema = await fetch(`${import.meta.env.VITE_POST_NEW}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: postAdd,
      });

      const posts = await postSchema.json();
      dispatch(setPosts({ posts }));
      setPreviewGambar('');
      setPreviewVideo('');
      setDescription('');
    } catch (error) {
      console.log({ massage: error.massage });
    }
  };

  //    Ngambil semua data dari POST API
  const allDataPost = async () => {
    let url = `${import.meta.env.VITE_POST_NEW}`;
    try {
      if (teman !== 'global') {
        url = teman;
      }
      if (selected) {
        url += `?description=${selected}`;
      }
      const dataAllPost = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await dataAllPost.json();

      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.log({ massage: error.massage });
    } finally {
      setIsLoading(false); // Set loading to false after data is received or an error occurs
    }
  };

  //   Gambar Preview dan Gambar post
  const newImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPreviewGambar(URL.createObjectURL(e.target.files[0]));
      setPicturePath(e.target.files[0]);
    }
    e.target.value = '';
  };

  // Memeriksa besar vidio
  const newVideo = (e) => {
    const maxSizeInBytes = 50485760;

    if (e.target.files.length && e.target.files[0].size < maxSizeInBytes) {
      setPreviewVideo(URL.createObjectURL(e.target.files[0]));
      setPicturePath(e.target.files[0]);
    }
    if (e.target.files.length && e.target.files[0].size > maxSizeInBytes) {
      alert('Image melebihi batas maximal : 10 mb');
    }
    e.target.value = '';
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      setSelected(e.target.value);
    }
  };

  useEffect(() => {
    allDataPost();
  }, [selected, teman]);

  return (
    <>
      <div className=" mt-4 d-flex flex-wrap justify-content-center">
        {/* Inputan POST  */}
        <div className="col-11 rounded-4 postSection">
          <div className="d-flex justify-content-center">
            <Link to={`/profile/${_id}`}>
              <img src={`${import.meta.env.VITE_GAMBAR_API}${picturePath}`} alt="" className="object-fit-cover iconPost col-2" />
            </Link>
            <input
              type="text"
              className="inputanPost col-10"
              placeholder={`Haii, post your idea here !!`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {previewGambar !== '' && (
            <div className="d-flex justify-content-center mt-3">
              <img src={previewGambar} alt="" style={{ maxWidth: '30rem' }} className="img-fluid rounded-4" />
              <MdOutlineClose
                size={20}
                className="iconSend mx-1"
                onClick={() => {
                  setPreviewGambar('');
                  setPicturePath('');
                }}
              />
            </div>
          )}
          {previewVideo !== '' && (
            <div className="d-flex justify-content-center mt-3">
              <video src={previewVideo} controls alt="" style={{ maxWidth: '40rem' }} className="ratio ratio-16x9 rounded-4" />
              <MdOutlineClose
                size={20}
                className="iconSend mx-1"
                onClick={() => {
                  setPreviewVideo('');
                  setPicturePath('');
                }}
              />
            </div>
          )}

          <hr className="hr" />
          <form onSubmit={postData}>
            <div className="d-flex justify-content-center text-center inputGambarPost ">
              <div className="col-3">
                <input type="file" id="photo" accept="image/jpg,image/jpeg, image/png , image/gif" onChange={newImage} />
                <label htmlFor="photo" className="inputPhoto">
                  <i className="bi bi-image mx-1"></i>
                  <span className="noTextInput">image</span>
                </label>
              </div>
              <div className="col-3">
                <input type="file" id="vidio" accept="video/mp4" onChange={newVideo} />
                <label htmlFor="vidio" className="inputPhoto">
                  <i className="bi bi-camera-reels mx-1"></i>
                  <span className="noTextInput">Video</span>
                </label>
              </div>
              <div className="col-3">
                <i className="bi bi-mic mx-1"></i>
                <span className="noTextInput">Clip</span>
              </div>
              <div className="col-3">
                <input type="submit" className="btn px-4 submitPost" />
              </div>
            </div>
          </form>
        </div>
        {/* Search Bar */}
        <div className="col-11 rounded-4 inputSection">
          <input type="text" name="Search" placeholder="Search Something ?" className="col-12 p-3 mt-3 searchBar" onKeyDown={handleEnterPress} />
          <div className="d-flex justify-content-center mt-2">
            <div
              className={
                global
                  ? ' btn col-5 mx-1 p-2 rounded-5 searchCategory text-center'
                  : 'btn col-5 mx-1 p-2 rounded-5 unsearchCategory border border-2 text-center'
              }
              onClick={(e) => {
                e.preventDefault();
                setTeman(`global`);
                setGlobal(false);
              }}
            >
              Global
            </div>
            <div
              className={
                global
                  ? ' btn col-5 mx-1 p-2 rounded-5 unsearchCategory text-center border border-2'
                  : 'btn col-5 mx-1 p-2 rounded-5 searchCategory text-center'
              }
              onClick={(e) => {
                e.preventDefault();
                setTeman(`${import.meta.env.VITE_POST_NEW}/${_id}/posts`);
                setGlobal(true);
              }}
            >
              Your Post
            </div>{' '}
          </div>
          <div className="col-12 rounded-4 isiPost p-4 py-5 my-3">
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-grow text-danger mx-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow warning mx-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow text-success mx-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="d-grid justify-content-center text-center">
                <img src="./assets/nofound.png" alt="noFound" className="img-fluid" />
                <p className="noFound">Can't Found that searching 😿</p>
              </div>
            ) : (
              posts.map((data, i) => (
                <div className=" p-5 border rounded-4 mb-3" key={i}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <Link to={`/profile/${data.userId}`}>
                        <img
                          src={`${import.meta.env.VITE_GAMBAR_API}${data.userPicturePath}`}
                          alt="Profile Image"
                          className="object-fit-cover iconPost col-2"
                        />
                      </Link>
                      <div className="d-grid p-3 namaUserPost">
                        <span>
                          {data.firstName} {data.lastName}
                        </span>
                        <span>{moment(data.createdAt).fromNow()}</span>
                      </div>
                    </div>
                    <Patchfriend userId={data.userId} conn={_id} id={data._id} />
                  </div>
                  <p className="text-justify textPost namaUserPost">{data.description}</p>
                  {/* Melakukan check jika gambar tidak berupa string kosong dan gambar berupa vidio atau image */}
                  {data.picturePath !== '' ? (
                    <div className="d-grid justify-content-center">
                      {data.picturePath.split('.').pop().toLowerCase() === 'mp4' ? (
                        <video src={`${import.meta.env.VITE_GAMBAR_API}${data.picturePath}`} controls className="ratio ratio-16x9 rounded-4" />
                      ) : (
                        <img
                          src={`${import.meta.env.VITE_GAMBAR_API}${data.picturePath}`}
                          alt="Image/Vidio Post"
                          className="object-fit-cover img-fluid rounded-4 d-flex gambarPostingan"
                        />
                      )}
                    </div>
                  ) : null}
                  <Commentar postId={data._id} likes={data.likes} comments={data.comments} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Homemiddle;
