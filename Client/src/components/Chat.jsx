import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { AiFillFileWord } from 'react-icons/ai';
import { RiFileExcel2Fill } from 'react-icons/ri';

function Chat({ chat, own, friendData }) {
  const { picturePath } = useSelector((state) => state.user);
  return (
    <>
      {own ? (
        <div className="col-12 d-flex mb-2">
          <div className="col-1 col-md-6"></div>
          <div className="col-11 col-md-6 text-end my-2">
            <div className="d-flex justify-content-end">
              <div className="d-grid  textIsiChat p-3 rounded-4 me-2">
                {chat.pictureChat === '' ? null : chat.pictureChat.split('.').pop().toLowerCase() === 'mp4' ? (
                  <video src={`${import.meta.env.VITE_GAMBAR_API}${chat.pictureChat}`} controls className="ratio ratio-16x9 rounded-4" />
                ) : ['jpg', 'jfif', 'png', 'jpeg', 'gif'].includes(chat.pictureChat.split('.').pop().toLowerCase()) ? (
                  <img
                    src={`${import.meta.env.VITE_GAMBAR_API}${chat.pictureChat}`}
                    className="img-fluid mb-2 object-fit-cover rounded-4 gambarIsiChat"
                    alt="GambarChat"
                  />
                ) : chat.pictureChat.toLowerCase().endsWith('.pdf') ? (
                  <a href={`${import.meta.env.VITE_GAMBAR_API}${chat.pictureChat}`} className="text-center text-decoration-none isiTeksChat mb-2">
                    <BsFileEarmarkPdfFill size={30} color="#FF0000" /> {chat.pictureChat}
                  </a>
                ) : chat.pictureChat.toLowerCase().endsWith('.doc') ? (
                  <a href={`${import.meta.env.VITE_GAMBAR_API}${chat.pictureChat}`} className="text-center text-decoration-none isiTeksChat mb-2">
                    <AiFillFileWord size={30} color="#4169E1" /> {chat.pictureChat}
                  </a>
                ) : chat.pictureChat.toLowerCase().endsWith('.xls') || chat.pictureChat.toLowerCase().endsWith('.xlsx') ? (
                  <a href={`${import.meta.env.VITE_GAMBAR_API}${chat.pictureChat}`} className="text-center text-decoration-none isiTeksChat mb-2">
                    <RiFileExcel2Fill size={30} color="#2E8B57" /> {chat.pictureChat}
                  </a>
                ) : (
                  <p>Format file tidak didukung</p>
                )}
                <p className="isiTeksChat mt-2">{chat.text} </p>
                <span className="text-end jam">{moment(chat.createdAt).format('lll')}</span>
              </div>
              <img src={`${import.meta.env.VITE_GAMBAR_API}${picturePath}`} alt="" className="object-fit-cover gambarChat col-2" />
            </div>
          </div>
        </div>
      ) : (
        <div className="col-12 d-flex">
          <div className="col-11 col-md-6 text-start my-2">
            <div className="d-flex">
              <img src={`${import.meta.env.VITE_GAMBAR_API}${friendData.picturePath}`} alt="" className="object-fit-cover gambarChat col-2" />

              <div className="d-grid textIsiChat p-3 rounded-4 ms-2">
                {chat.pictureChat === '' ? null : chat.pictureChat.split('.').pop().toLowerCase() === 'mp4' ? (
                  <video src={`${import.meta.env.VITE_GAMBAR_API}${chat.pictureChat}`} controls className="ratio ratio-16x9 rounded-4" />
                ) : ['jpg', 'jfif', 'png', 'jpeg', 'gif'].includes(chat.pictureChat.split('.').pop().toLowerCase()) ? (
                  <img
                    src={`${import.meta.env.VITE_GAMBAR_API}${chat.pictureChat}`}
                    className="img-fluid mb-2 object-fit-cover rounded-4 gambarIsiChat"
                    alt="GambarChat"
                  />
                ) : chat.pictureChat.toLowerCase().endsWith('.pdf') ? (
                  <a href={`${import.meta.env.VITE_GAMBAR_API}${chat.pictureChat}`} className="text-center text-decoration-none isiTeksChat mb-2">
                    <BsFileEarmarkPdfFill size={30} color="#FF0000" /> {chat.pictureChat}
                  </a>
                ) : chat.pictureChat.toLowerCase().endsWith('.doc') ? (
                  <a href={`${import.meta.env.VITE_GAMBAR_API}${chat.pictureChat}`} className="text-center text-decoration-none isiTeksChat mb-2">
                    <AiFillFileWord size={30} color="#4169E1" /> {chat.pictureChat}
                  </a>
                ) : chat.pictureChat.toLowerCase().endsWith('.xls') || chat.pictureChat.toLowerCase().endsWith('.xlsx') ? (
                  <a href={`${import.meta.env.VITE_GAMBAR_API}${chat.pictureChat}`} className="text-center text-decoration-none isiTeksChat mb-2">
                    <RiFileExcel2Fill size={30} color="#2E8B57" /> {chat.pictureChat}
                  </a>
                ) : (
                  <p>Format file tidak didukung</p>
                )}
                <p className="isiTeksChat">{chat.text} </p>
                <span className="text-end jam">{moment(chat.createdAt).format('lll')}</span>
              </div>
            </div>
          </div>
          <div className="col-1 col-md-6"></div>
        </div>
      )}
    </>
  );
}

export default Chat;
