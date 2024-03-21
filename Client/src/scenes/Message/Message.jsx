import React, { useEffect, useRef, useState } from 'react';
import './Message.css';
import { useSelector } from 'react-redux';
import ConverstationUser from '../../components/ConverstationUser';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import Chat from '../../components/Chat';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { RiSendPlaneLine } from 'react-icons/ri';
import { BsImage } from 'react-icons/bs';
import { MdOutlineClose } from 'react-icons/md';
import { TiAttachment } from 'react-icons/ti';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { AiFillFileWord } from 'react-icons/ai';
import { RiFileExcel2Fill } from 'react-icons/ri';

// Socket Io
import { io } from 'socket.io-client';

function Message() {
  // socket Io
  const socket = useRef();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const { _id } = useSelector((state) => state.user);
  const [mobile, setMobile] = useState(true);
  const [converstation, setConverstation] = useState([]);
  const [chat, setChat] = useState(null);
  const [pesan, setPesan] = useState([]);
  const [friendData, setFriendData] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [previewGambar, setPreviewGambar] = useState('');
  const [previewVideo, setPreviewVideo] = useState('');
  const [picture, setPicturePath] = useState('');
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [stringGambar, setStringGambar] = useState('');
  const [allChat, setAllChat] = useState('ok');
  const [allFriends, setAllFriends] = useState([]);
  const [previewFile, setPreviewFile] = useState('');
  console.log('pesan', pesan);

  //=============================  Socket Io sender user_id and get Users ==============================
  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_SOCKET_API}`);
    socket.current.on('getMessage', (data) => {
      console.log('data', data);
      setArrivalMessage({
        senderId: data.senderId,
        text: data.text,
        pictureChat: data.pictureChat,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    console.log(`ArrivalMessage :`, arrivalMessage);
    console.log('======================================');
    arrivalMessage && chat?.userIdChat.includes(arrivalMessage.senderId) && setPesan((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, chat]);

  // To get online User and Add user
  useEffect(() => {
    socket.current.emit('addUser', user._id);
    socket.current.on('getUsers', (users) => {
      console.log(users.length);
    });
  }, [token]);
  // ===================================== Perbatasan socket .io ====================================

  const getConverstation = async () => {
    try {
      const ngambilConverstation = await fetch(`${import.meta.env.VITE_MESSAGE_NEW}/${user._id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await ngambilConverstation.json();

      setConverstation(data);
    } catch (error) {
      console.log(error);
    }
  };
  const FriendData = async () => {
    try {
      let friendId = '';
      if (chat !== '' && chat?.userIdChat) {
        friendId = await chat?.userIdChat.find((id) => id !== user._id);
      }
      const response = await fetch(`${import.meta.env.VITE_USER_API}${friendId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setFriendData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getChat = async () => {
    try {
      const getChatFromId = await fetch(`${import.meta.env.VITE_MESSAGE_NEW}/chat/${chat?._id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await getChatFromId.json();
      setPesan(data);
    } catch (error) {
      console.log(error);
    }
  };

  const newChat = async (e) => {
    e.preventDefault();
    const messageNew = new FormData();
    messageNew.append('converstationId', chat._id);
    messageNew.append('sender', user._id);
    messageNew.append('text', newMessage);
    messageNew.append('pictureChat', picture);

    const receiverId = chat.userIdChat.find((id) => id !== user._id);

    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessage,
      pictureChat: stringGambar,
    });
    setStringGambar('');
    try {
      const messageAPI = await fetch(`${import.meta.env.VITE_MESSAGE_NEW}/chat`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: messageNew,
      });
      const posts = await messageAPI.json();
      setPesan([...pesan, posts]);
      setNewMessage('');
      setPreviewGambar('');
      setPreviewVideo('');
      setPreviewFile('');
      setPicturePath('');
    } catch (error) {
      console.log(error);
    }
  };

  const allUser = async () => {
    let url = `${import.meta.env.VITE_USER_API}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const posts = data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setAllFriends(posts);
    } catch (error) {
      console.log(error);
    }
  };

  const BuatConverstationBaru = async (userId) => {
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
        setAllChat('ok');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const newImages = (e) => {
    const maxSizeInBytes = 10485760;
    const selectedFile = e.target.files[0];
    if (selectedFile.name.toLowerCase().endsWith('.mp4')) {
      if (e.target.files && e.target.files[0].size < maxSizeInBytes) {
        setPreviewVideo(URL.createObjectURL(e.target.files[0]));
        setPicturePath(e.target.files[0]);
        setStringGambar(e.target.files[0].name);
      }
      if (e.target.files && e.target.files[0].size > maxSizeInBytes) {
        alert('Image melebihi batas maximal : 10 mb');
      }
    } else if (['jpg', 'jfif', 'png', 'jpeg', 'gif'].includes(selectedFile.name.split('.').pop().toLowerCase())) {
      if (e.target.files && e.target.files[0]) {
        setPreviewGambar(URL.createObjectURL(e.target.files[0]));
        setPicturePath(e.target.files[0]);
        setStringGambar(e.target.files[0].name);
      }
    } else {
      if (e.target.files && e.target.files[0]) {
        setPreviewFile(e.target.files[0].name);
        setPicturePath(e.target.files[0]);
        setStringGambar(e.target.files[0].name);
      }
      e.target.value = '';
    }
  };

  useEffect(() => {
    getConverstation();
    allUser();
  }, []);

  useEffect(() => {
    getConverstation();
  }, [allChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [pesan]);

  useEffect(() => {
    getChat();
    FriendData();
  }, [chat]);

  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-center backgorund">
          <div className="col-12 col-lg-4 p-4 my-3">
            {/* Row Kiri Atas */}
            <div className="col-12 d-flex row-kiri-atas rounded-4">
              <img src={`${import.meta.env.VITE_GAMBAR_API}${user.picturePath}`} alt="" className="object-fit-cover gambarMessanger col-2" />
              <div className="d-grid align-content-center mx-3 namaMessage">
                <span className="titleNamaMassage">
                  {user.firstName}
                  {user.lastName}
                </span>
                <span className="status">{user.occupation}</span>
              </div>
            </div>

            {/*  Row kiri tengah search bar */}
            <div className="col-12 d-flex rounded-4">
              <input type="text" name="Search" placeholder="Search Chat ?" className="col-12 p-3 mt-3 searchBarMessage" />
            </div>
            {/* Row kiri bawah */}
            <div className="col-12 flex-wrap mt-3 p-4 isiChat">
              <p className="chat">Chat</p>
              <div className="d-flex text-center ">
                <span className="col-6 status border-end pointer " onClick={() => setAllChat('ok')}>
                  Your Chat
                </span>
                <span className="col-6 status border-start pointer " onClick={() => setAllChat('gaOke')}>
                  All User{' '}
                </span>
              </div>
              <hr className="hr" />
              <div className="isiChatDalam">
                {allChat === 'ok'
                  ? converstation.map((data, i) => (
                      <div key={i}>
                        <ConverstationUser
                          setMobile={() => setMobile(!mobile)}
                          setChat={() => setChat(data)}
                          converstation={data}
                          userlogin={user._id}
                          token={token}
                        />
                      </div>
                    ))
                  : allFriends.map((data, i) => (
                      <div
                        key={i}
                        className="btn d-flex p-2 rounded-3 "
                        onClick={() => {
                          setMobile(!mobile);
                          BuatConverstationBaru(data._id);
                        }}
                      >
                        {data.picturePath ? (
                          <img src={`${import.meta.env.VITE_GAMBAR_API}${data.picturePath}`} alt="" className="object-fit-cover gambarChat col-2" />
                        ) : null}
                        <div className="d-grid align-content-center mx-3 namaMessage">
                          <span className="titleNamaMassage">
                            {data.firstName} {data.lastName}
                          </span>
                          <span className="status">{data.occupation}</span>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
          <div className={mobile ? 'col-12 col-lg-7  my-3 kananweb' : 'col-12 col-lg-7 p-4 my-3 kananMobile'}>
            {chat ? (
              <div className="col-12 row-kanan">
                {/* Row Kanan Atas */}
                <div
                  className="col-12 px-3 py-1 rounded-3 d-flex justify-content-between align-items-center row-atas-kanan pointer"
                  onClick={() => setMobile(!mobile)}
                >
                  <div className="d-flex">
                    {friendData.picturePath ? (
                      <img src={`${import.meta.env.VITE_GAMBAR_API}${friendData.picturePath}`} alt="" className="object-fit-cover gambarChat col-2" />
                    ) : null}
                    <div className="d-grid align-content-center mx-3 namaMessage">
                      <span className="titleNamaMassage">
                        {friendData.firstName} {friendData.lastName}
                      </span>
                      <span className="status">{friendData.occupation}</span>
                    </div>
                  </div>

                  <BiDotsVerticalRounded size={25} className="iconSend" />
                </div>
                <hr className="hr" />
                {/* Row-kanan-tengah */}
                <div className="col-12 row-tengah-kanan mt-3 p-3 ">
                  {pesan.map((chat, i) => (
                    <div ref={scrollRef} key={i}>
                      <Chat chat={chat} own={chat.sender === user._id} friendData={friendData} />
                    </div>
                  ))}

                  {previewGambar !== '' && (
                    <div className="boxPreview py-4">
                      <div className="d-flex justify-content-center">
                        <img src={previewGambar} className="img-fluid border-2 rounded-4  gambarPreview" alt="" />
                        {console.log('Noo: ', previewGambar)}
                        <MdOutlineClose size={20} className="iconSend mx-1" onClick={() => setPreviewGambar('')} />
                      </div>
                      <div className="d-flex justify-content-center">
                        <p className="descPreview">{newMessage}</p>
                      </div>
                    </div>
                  )}
                  {previewVideo !== '' && (
                    <div className="boxPreview py-4">
                      <div className="d-flex justify-content-center">
                        <video src={previewVideo} controls className="ratio ratio-4x3 rounded-4 videoPreview" alt="" />
                        <MdOutlineClose size={20} className="iconSend mx-1" onClick={() => setPreviewVideo('')} />
                      </div>
                      <div className="d-flex justify-content-center">
                        <p className="descPreview">{newMessage}</p>
                      </div>
                    </div>
                  )}
                  {previewFile !== '' && (
                    <div className="boxPreview py-4">
                      <div className="d-flex justify-content-center">
                        {previewFile.toLowerCase().endsWith('.pdf') ? (
                          <div className="d-flex flex-column rounded-4 p-4 previewPdfDocXlxs ">
                            <BsFileEarmarkPdfFill size={40} color="#FF0000" /> <span className="isiTeksChat">{previewFile}</span>
                          </div>
                        ) : previewFile.toLowerCase().endsWith('.doc') ? (
                          <div className="d-flex flex-column rounded-4 p-4 previewPdfDocXlxs ">
                            <AiFillFileWord size={40} color="#4169E1" /> <span className="isiTeksChat">{previewFile}</span>
                          </div>
                        ) : previewFile.toLowerCase().endsWith('.xlsx') ? (
                          <div className="d-flex flex-column rounded-4 p-4 previewPdfDocXlxs ">
                            <RiFileExcel2Fill size={40} color="#2E8B57" /> <span className="isiTeksChat">{previewFile}</span>
                          </div>
                        ) : (
                          <p>{console.log('Noo: ', previewFile)}</p>
                        )}

                        <MdOutlineClose size={20} className="iconSend mx-1" onClick={() => setPreviewFile('')} />
                      </div>
                      <div className="d-flex justify-content-center">
                        <p className="descPreview">{newMessage}</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Row-Kanan-Bawah */}{' '}
                <form onSubmit={newChat}>
                  <div className="col-12 d-flex align-items-center py-1 border-2 rounded-3 justify-content-center mt-2 row-kanan-bawah ">
                    <div className="col-9 col-md-9">
                      <input
                        type="text"
                        placeholder="Kirim pesan ..."
                        className="col-12 rounded-3 border-0 p-2 inputChat"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-3 col-md-3 d-flex justify-content-end align-items-center  ">
                      <input type="file" id="file" accept="image/jpg,image/jpeg, image/png , image/gif, video/mp4" onChange={newImages} />
                      <input
                        type="file"
                        id="pdf"
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={newImages}
                      />
                      <label htmlFor="pdf" className="inputPhoto">
                        <TiAttachment size={25} className="iconSend mx-1" />
                      </label>
                      <label htmlFor="file" className="inputPhoto">
                        <BsImage size={20} className="iconSend mx-1" />
                      </label>
                      <button type="submit" className="bg-transparent border-0">
                        <RiSendPlaneLine size={20} className="iconSend mx-1" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="col-12 row-kanan d-flex flex-column justify-content-center align-items-center">
                <HiOutlineChatBubbleLeftRight size={100} className="iconSend text-center" />
                <span className="iconSend">Let's chat with your friends ✨</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Message;
