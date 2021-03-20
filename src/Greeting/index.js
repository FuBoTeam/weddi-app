import React, { useState, useMemo } from 'react';
import { range } from '../utils/range';
import uuid from 'uuid';
import loadImage from 'blueimp-load-image';
import './greeting.scss';

import configService from '../services/configService';
import { combinationList } from '../utils/random';
import { getImageUrl } from '../images';
import Dialog from '../Board/Dialog';
import loadingIcon from '../images/uploadLoading.svg';
import { uploadImage, writePost } from '../api';
import { useDatabase, useStorage } from '../Provider/FirebaseApp';
import { ImagePicker } from './ImagePicker';

const Greeting = (props) => {
  const allImgUrls = useMemo(() => range(configService.config.img.totalImgs).map(k => getImageUrl(k)), []);
  const fmImgsShouldBePicked = configService.config.img.fmImgsShouldBePicked;
  const imgUrls = useMemo(() => combinationList(allImgUrls, fmImgsShouldBePicked), [allImgUrls, fmImgsShouldBePicked]);
  const [isUploadPage, setIsUploadPage] = useState(false);
  const [modalDisplay, setModalDisplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [upload, setUpload] = useState(null);
  const [pickedImg, setPickedImg] = useState(imgUrls[0]);
  const [form, setForm] = useState({
    name: '',
    greetings: '',
  });
  const database = useDatabase();
  const storage = useStorage();

  const getUpperUrl = () => {
    const matchUrl = props.match.url;
    const paths = matchUrl.split('/');
    paths.pop();
    return paths.join('/');
  };

  const renderUploadImageSection = () => {
    const onFileChangeHandler = (event) => {
      const key = event.target.name;
      const value = event.target.files[0];
      if (key && value && value.type.startsWith('image/')) {
        loadImage(
          value,
          canvas => canvas.toBlob(blob => {
            setUpload(blob);
          }, 'image/jpeg', 0.75),
          { maxWidth: 2048, maxHeight: 2048, orientation: true, canvas: true, noRevoke: true }
        );
      }
    };

    return (
      <label className="img-window upload">
        <input
          hidden
          type="file"
          name="upload"
          placeholder="上傳照片"
          accept="image/*"
          onChange={onFileChangeHandler}
          disabled={isLoading}
        />
        {upload && <img src={URL.createObjectURL(upload)} alt="upload preview" />}
        {!upload && <span className="upload-field">請上傳圖片</span>}
      </label>
    );
  };

  const renderGreetingForm = () => {
    const onTextChangeHandler = (event) => {
      const key = event.target.name;
      const value = event.target.value.trim();
      setForm((form) => ({ ...form, [key]: value }));
    };

    const onSubmitHandler = (event) => {
      event.preventDefault();
      const isValid = () => {
        const { name, greetings } = form;
        return name.trim() !== '' && greetings.trim() !== '' && (pickedImg || upload);
      };
      if (isValid()) {
        const uploadFlow = async () => {
          setIsLoading(true);
          let imgUrl = pickedImg;
          if (isUploadPage && upload) {
            const imgName = uuid.v4();
            const uploadProc = await uploadImage(storage)(imgName, upload);
            imgUrl = await uploadProc.ref.getDownloadURL();
          }
          await writePost(database)({
            name: form.name,
            greetings: form.greetings,
            imgUrl,
          });
          const updateStateAndRedirect = () => {
            setPickedImg(imgUrl);
            setModalDisplay(true);
            setIsLoading(false);
            setTimeout(() => { props.history.push(getUpperUrl()); }, 5000);
          };
          updateStateAndRedirect();
        };
        return uploadFlow();
      }
    };

    const onPickerClick = () => {
      if (!isLoading) {
        setIsUploadPage(false);
      }
    };

    const onPickerChange = (imgUrl) => {
      setPickedImg(imgUrl);
    };

    const onUploaderClick = () => {
      if (!isLoading) {
        setIsUploadPage(true);
      }
    };

    return (
      <form className="greeting-form" onSubmit={onSubmitHandler}>
        <ul className="tabs-view">
          <li
            className={`pick ${isUploadPage ? '' : 'active'}`}
            onClick={onPickerClick}
          >
            挑一張照片
          </li>
          <li
            className={`pick ${isUploadPage ? 'active' : ''}`}
            onClick={onUploaderClick}
          >
            上傳一張照片
          </li>
        </ul>
        <div className="slideshow-container">
          <div hidden={!isUploadPage}>{renderUploadImageSection()}</div>
          <div hidden={isUploadPage}>
            <ImagePicker disabled={isLoading} imgUrls={imgUrls} onChange={onPickerChange} />
          </div>
        </div>
        <div className="greeting-message-block">
          <label className="input">
            <h2>@</h2>
            <input type="text" name="name" placeholder="姓名" onChange={onTextChangeHandler} required disabled={isLoading} />
          </label>
          <label className="input">
            <textarea name="greetings" placeholder="祝賀詞" onChange={onTextChangeHandler} required disabled={isLoading} />
          </label>
        </div>
        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading && <img className="loading-img" src={loadingIcon} alt="" />}
          留言
        </button>
        <a className="link orange-font" href={getUpperUrl()}>去照片牆瞧瞧</a>
      </form>
    );
  };

  return (
    <div className="greeting">
      <header className="greeting-header">
        <h1 className="greeting-title orange-font">祝福留言版</h1>
      </header>
      {!modalDisplay && renderGreetingForm()}
      <Dialog user={{
        ...form,
        imgUrl: pickedImg,
      }} show={modalDisplay} />
    </div>
  );
};

export default Greeting;
