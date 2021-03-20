import React, { useState, useMemo, ChangeEventHandler, FormEventHandler } from 'react';
import { range } from '../utils/range';
import uuid from 'uuid';
import './greeting.scss';

import configService from '../services/configService';
import { combinationList } from '../utils/random';
import { getImageUrl } from '../images';
import loadingIcon from '../images/uploadLoading.svg';
import { uploadImage, writePost } from '../api';
import { useDatabase, useStorage } from '../Provider/FirebaseApp';
import { ImagePicker } from './ImagePicker';
import { ImageUploader } from './ImageUploader';

interface Props {
  onSubmit?: (formData: {name: string; greetings: string; imgUrl: string}) => void;
}

export const GreetingForm = ({ onSubmit }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const [form, setForm] = useState({
    name: '',
    greetings: '',
  });
  const [isUploadPage, setIsUploadPage] = useState(false);
  const allImgUrls = useMemo(() => range(configService.config.img.totalImgs).map(k => getImageUrl(k)), []);
  const fmImgsShouldBePicked = configService.config.img.fmImgsShouldBePicked;
  const imgUrls = useMemo(() => combinationList(allImgUrls, fmImgsShouldBePicked), [allImgUrls, fmImgsShouldBePicked]);
  const [pickedImg, setPickedImg] = useState(imgUrls[0]);
  const [uploadImg, setUploadImg] = useState<Blob | null>(null);

  const database = useDatabase();
  const storage = useStorage();

  const onTextChangeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    const key = event.target.name;
    const value = event.target.value.trim();
    setForm((form) => ({ ...form, [key]: value }));
  };

  const onSubmitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    const isValid = () => {
      const { name, greetings } = form;
      return name.trim() !== '' && greetings.trim() !== '' && (pickedImg || uploadImg);
    };
    if (isValid()) {
      const uploadFlow = async () => {
        setIsProcessing(true);
        let imgUrl = pickedImg;
        if (isUploadPage && uploadImg) {
          const imgName = uuid.v4();
          const uploadProc = await uploadImage(storage)(imgName, uploadImg);
          imgUrl = await uploadProc.ref.getDownloadURL();
        }
        await writePost(database)({
          name: form.name,
          greetings: form.greetings,
          imgUrl,
        });

        setPickedImg(imgUrl);
        setIsProcessing(false);

        if (onSubmit) {
          onSubmit({
            name: form.name,
            greetings: form.greetings,
            imgUrl
          });
        }
      };
      return uploadFlow();
    }
  };

  const onPickerClick = () => {
    if (!isProcessing) {
      setIsUploadPage(false);
    }
  };

  const onPickerChange = (imgUrl: string) => {
    setPickedImg(imgUrl);
  };

  const onUploaderClick = () => {
    if (!isProcessing) {
      setIsUploadPage(true);
    }
  };

  const onUploaderChange = (blob: Blob | null) => {
    setUploadImg(blob);
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
        <div hidden={!isUploadPage}>
          <ImageUploader disabled={isProcessing} onChange={onUploaderChange} />
        </div>
        <div hidden={isUploadPage}>
          <ImagePicker disabled={isProcessing} imgUrls={imgUrls} onChange={onPickerChange} />
        </div>
      </div>
      <div className="greeting-message-block">
        <label className="input">
          <h2>@</h2>
          <input type="text" name="name" placeholder="姓名" onChange={onTextChangeHandler} required disabled={isProcessing} />
        </label>
        <label className="input">
          <textarea name="greetings" placeholder="祝賀詞" onChange={onTextChangeHandler} required disabled={isProcessing} />
        </label>
      </div>
      <button className="btn" type="submit" disabled={isProcessing}>
        {isProcessing && <img className="loading-img" src={loadingIcon} alt="" />}
        留言
      </button>
    </form>
  );
};
