import React, { useState } from 'react';
import range from 'lodash/range';
import uuid from 'uuid';
import loadImage from 'blueimp-load-image';
import './greeting.scss';

import Config from '../config';
import { combinationList } from '../utils/random';
import { preloadImage, getImageUrl } from '../images';
import Dialog from '../Board/Dialog';
import loadingIcon from '../images/uploadLoading.svg';
import * as Api from '../api';
import { RouteComponentProps } from 'react-router';

const Greeting = (props: RouteComponentProps) => {
  const allImgUrls = range(Config.img.totalImgs).map(k => getImageUrl(k));
  const fmImgsShouldBePicked = Config.img.fmImgsShouldBePicked;
  const imgUrls = combinationList(allImgUrls, fmImgsShouldBePicked);
  const [form, setForm] = useState({
    name: '',
    greetings: '',
    pickedImg: {
      idx: 0,
      url: imgUrls[0],
    },
    upload: new Blob(),
  });
  const [isUploadPage, setIsUploadPage] = useState(false);
  const [modalDisplay, setModalDisplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getUpperUrl = () => {
    const matchUrl = props.match.url;
    const paths = matchUrl.split('/');
    paths.pop();
    return paths.join('/');
  };

  const getFormData = () => {
    return {
      ...form,
      imgUrl: form.pickedImg.url,
    };
  };

  const onFileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    const value = event.target.files && event.target.files[0];
    if (key && value && value.type.startsWith('image/')) {
      loadImage(
        value,
        canvas => (canvas as HTMLCanvasElement).toBlob(blob => {
          setForm(form => ({ ...form, [key]: blob }));
        }, "image/jpeg", 0.75),
        { maxWidth: 2048, maxHeight: 2048, orientation: true, canvas: true, noRevoke: true }
      );
    }
  };

  const onTextChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const key = event.target.name;
    const value = event.target.value.trim();
    setForm((form) => ({ ...form, [key]: value }));
  };

  const isValid = () => {
    const { name, greetings, pickedImg } = form;
    return name.trim() !== '' && greetings.trim() !== '' && pickedImg.url !== undefined;
  };

  const uploadFlow = async () => {
    setIsLoading(true);
    let imgUrl = form.pickedImg.url;
    if (isUploadPage && form.upload) {
      const imgName = uuid.v4();
      const uploadProc = await Api.uploadImage(imgName, form.upload);
      imgUrl = await uploadProc.ref.getDownloadURL();
      setForm(form => ({
        ...form,
        pickedImg: {
          idx: -1,
          url: imgUrl
        }
      }));
    }
    await Api.writePost(getFormData());
    const updateStateAndRedirect = () => {
      setModalDisplay(true);
      setIsLoading(false);
      setTimeout(() => { props.history.push(getUpperUrl()); }, 5000);
    };
    preloadImage(imgUrl, updateStateAndRedirect);
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValid()) {
      return uploadFlow();
    }
  };

  const getImg = (idx: number) => {
    return ({ idx, url: imgUrls[idx] });
  };

  const plusImgIdx = (i: number) => {
    const nextIdx = (form.pickedImg.idx + i + fmImgsShouldBePicked) % fmImgsShouldBePicked;
    // set img idx to render the seleceted img
    setForm(form => ({
      ...form, pickedImg: getImg(nextIdx)
    }));
  };

  const renderPhotoRadios = () => imgUrls.map((url, i) => {
    const checked = form.pickedImg.idx === i && form.pickedImg.url === url;
    return (
      <React.Fragment key={`image_${i}`}>
        <input hidden type="radio" name="imgUrl" value={url} checked={checked} readOnly />
        <div className={"layer" + (checked ? "" : " hidden")} style={{ backgroundImage: `url(${url})` }} />
        <img className={"fade" + (checked ? "" : " hidden")} src={url} alt={url} />
      </React.Fragment>
    );
  });

  const renderUploadImageSection = () => {
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
        {form.upload && <img src={URL.createObjectURL(form.upload)} alt="upload preview" />}
        {!form.upload && <span className="upload-field">請上傳圖片</span>}
      </label>
    );
  };

  const renderPickImageSection = () => {
    return (
      <React.Fragment>
        <div className="img-window">
          <div className="numbertext">{form.pickedImg.idx + 1} / {fmImgsShouldBePicked}</div>
          {renderPhotoRadios()}
        </div>
        <span className="prev" onClick={() => !isLoading && plusImgIdx(-1)}>&#10094;</span>
        <span className="next" onClick={() => !isLoading && plusImgIdx(1)}>&#10095;</span>
      </React.Fragment>
    );
  };

  const renderGreetingForm = () => {
    return (
      <form className="greeting-form" onSubmit={onSubmitHandler}>
        <ul className="tabs-view">
          <li
            className={ isUploadPage ? 'pick' : 'pick active' }
            onClick={() => !isLoading && setIsUploadPage(false)}
          >
            挑一張照片
          </li>
          <li
            className={ isUploadPage ? 'pick active' : 'pick' }
            onClick={() => !isLoading && setIsUploadPage(true)}
          >
            上傳一張照片
          </li>
        </ul>
        <div className="slideshow-container">
          <div hidden={!isUploadPage}>{renderUploadImageSection()}</div>
          <div hidden={isUploadPage}>{renderPickImageSection()}</div>
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
      <Dialog user={getFormData()} show={modalDisplay} />
    </div>
  );
};

export default Greeting;
