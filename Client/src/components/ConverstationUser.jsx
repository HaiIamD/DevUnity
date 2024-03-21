import React, { useEffect, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { MdCancel } from 'react-icons/md';

function ConverstationUser({ setMobile, setChat, converstation, userlogin, token }) {
  const [dataTeman, setDataTeman] = useState([]);
  const [deleteChat, setDeleteChat] = useState(true);

  const friendId = converstation.userIdChat.find((id) => id !== userlogin);
  const getFriends = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_USER_API}${friendId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      setDataTeman(data);
    } catch (error) {
      console.log(error);
    }
  };

  const HapusChat = async (e) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_MESSAGE_NEW}/delete/${e}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        alert('Chat berhasil di hapus ');
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);
  return (
    <>
      <div className="btn d-flex justify-content-between align-items-center p-2 rounded-3 ">
        <div
          className="d-flex col-9"
          onClick={() => {
            setMobile();
            setChat();
          }}
        >
          {dataTeman.picturePath ? (
            <img src={`${import.meta.env.VITE_GAMBAR_API}${dataTeman.picturePath}`} alt="" className="object-fit-cover gambarChat col-2" />
          ) : null}
          <div className="d-grid align-content-center mx-3 namaMessage">
            <span className="titleNamaMassage">
              {dataTeman.firstName} {dataTeman.lastName}
            </span>
            <span className="status">{dataTeman.occupation}</span>
          </div>
        </div>

        <div>
          {deleteChat ? (
            <BiDotsVerticalRounded size={25} className="iconSend" onClick={() => setDeleteChat(!deleteChat)} />
          ) : (
            <div>
              <MdDelete size={25} className="iconSend ms-2" onClick={() => HapusChat(converstation._id)} />
              <MdCancel size={25} className="iconSend ms-2" onClick={() => setDeleteChat(!deleteChat)} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ConverstationUser;
