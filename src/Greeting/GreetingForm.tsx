import React, { useState, ChangeEventHandler, FormEventHandler, useEffect } from 'react';
import uuid from 'uuid';
import loadingIcon from '../images/uploadLoading.svg';
import './greeting.scss';

import { useDatabase, useStorage } from '../Provider/FirebaseApp';
import { listRandomKImages, uploadImage, writePost } from '../api';
import configService from '../services/configService';
import { ImagePicker } from './ImagePicker';
import { ImageUploader } from './ImageUploader';

interface Props {
  onSubmit?: (formData: WeddiApp.Post.UserInput) => void;
}

export const GreetingForm: React.FC<Props> = ({ onSubmit }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const [form, setForm] = useState({
    name: '',
    greetings: '',
  });
  const [isUploadPage, setIsUploadPage] = useState(false);

  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [pickedImg, setPickedImg] = useState('');
  const [uploadImg, setUploadImg] = useState<Blob | null>(null);

  const database = useDatabase();
  const storage = useStorage();

  useEffect(() => {
    listRandomKImages(storage, configService.config.img.fmImgsShouldBePicked).then(imgUrls => {
      setImgUrls(imgUrls);
      setPickedImg(imgUrls[0]);
    });
  }, [storage]);

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
          imgUrl = await uploadImage(storage, imgName, uploadImg);
        }

        const input: WeddiApp.Post.UserInput = {
          name: form.name,
          greetings: form.greetings,
          joinedGame: true,
          imgUrl,
        };

        await writePost(database, input);

        setPickedImg(imgUrl);
        setIsProcessing(false);

        if (onSubmit) {
          onSubmit(input);
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
