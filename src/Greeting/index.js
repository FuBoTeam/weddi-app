import React, { Component } from 'react';
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

class Greeting extends Component {
  allImgUrls = range(Config.img.totalImgs).map(k => getImageUrl(k));
  fmImgsShouldBePicked = Config.img.fmImgsShouldBePicked;
  imgUrls = combinationList(this.allImgUrls, this.fmImgsShouldBePicked);
  state = {
    form: {
      name: '',
      greetings: '',
      pickedImg: {
        idx: 0,
        url: this.imgUrls[0],
      },
      upload: null,
    },
    isUploadPage: false,
    modalDisplay: false,
    isLoading: false
  };

  onFileChangeHandler = this.onFileChangeHandler.bind(this);
  onTextChangeHandler = this.onTextChangeHandler.bind(this);
  onSubmitHandler = this.onSubmitHandler.bind(this);
  isValid = this.isValid.bind(this);
  getImg = this.getImg.bind(this);
  plusImgIdx = this.plusImgIdx.bind(this);

  getUpperUrl() {
    const matchUrl = this.props.match.url;
    const paths = matchUrl.split('/');
    paths.pop();
    return paths.join('/');
  }

  getFormData() {
    return {
      ...this.state.form,
      imgUrl: this.state.form.pickedImg.url,
    };
  }

  onFileChangeHandler(event) {
    const key = event.target.name;
    const value = event.target.files[0];
    if (key && value && value.type.startsWith('image/')) {
      loadImage(
        value,
        canvas => canvas.toBlob(blob => {
          this.setState(({ form }) => ({ form: { ...form, [key]: blob } }));
        }, "image/jpeg", 0.75),
        { maxWidth: 2048, maxHeight: 2048, orientation: true, canvas: true, noRevoke: true }
      );
    }
  }

  onTextChangeHandler(event) {
    const key = event.target.name;
    const value = event.target.value.trim();
    this.setState(({ form }) => ({ form: { ...form, [key]: value } }));
  }

  onSubmitHandler(event) {
    event.preventDefault();
    if (this.isValid()) {
      return this.uploadFlow();
    }
  }

  async uploadFlow() {
    this.setState({ isLoading: true });
    let imgUrl = this.state.form.pickedImg.url;
    if (this.state.isUploadPage && this.state.form.upload) {
      const imgName = uuid.v4();
      const uploadProc = await Api.uploadImage(imgName, this.state.form.upload);
      imgUrl = await uploadProc.ref.getDownloadURL();
      this.setState({
        form: {
          ...this.state.form,
          pickedImg: {
            idx: -1,
            url: imgUrl
          }
        }
      });
    }
    await Api.writePost(this.getFormData());
    const updateStateAndRedirect = () => {
      this.setState({ modalDisplay: true, isLoading: false });
      setTimeout(() => { this.props.history.push(this.getUpperUrl()); }, 5000);
    };
    preloadImage(imgUrl, updateStateAndRedirect);
  }

  getImg(idx) {
    return ({ idx, url: this.imgUrls[idx] });
  }

  plusImgIdx(i) {
    const nextIdx = (this.state.form.pickedImg.idx + i + this.fmImgsShouldBePicked) % this.fmImgsShouldBePicked;
    // set img idx to render the seleceted img
    this.setState(({ form }) => ({
      form: { ...form, pickedImg: this.getImg(nextIdx) }
    }));
  }

  isValid() {
    const { name, greetings, pickedImg } = this.state.form;
    return name.trim() !== '' && greetings.trim() !== '' && pickedImg.url !== undefined;
  }

  renderPhotoRadios = () => this.imgUrls.map((url, i) => {
    const checked = this.state.form.pickedImg.idx === i && this.state.form.pickedImg.url === url;
    return (
      <React.Fragment key={`image_${i}`}>
        <input hidden type="radio" name="imgUrl" value={url} checked={checked} readOnly />
        <div className={"layer" + (checked ? "" : " hidden")} style={{ backgroundImage: `url(${url})` }} />
        <img className={"fade" + (checked ? "" : " hidden")} src={url} alt={url} />
      </React.Fragment>
    );
  });

  renderUploadImageSection() {
    return (
      <label className="img-window upload">
        <input
          hidden
          type="file"
          name="upload"
          placeholder="上傳照片"
          accept="image/*"
          onChange={this.onFileChangeHandler}
          disabled={this.state.isLoading}
        />
        {this.state.form.upload && <img src={URL.createObjectURL(this.state.form.upload)} alt="upload preview" />}
        {!this.state.form.upload && <span className="upload-field">請上傳圖片</span>}
      </label>
    );
  }

  renderPickImageSection() {
    return (
      <React.Fragment>
        <div className="img-window">
          <div className="numbertext">{this.state.form.pickedImg.idx + 1} / {this.fmImgsShouldBePicked}</div>
          {this.renderPhotoRadios()}
        </div>
        <span className="prev" onClick={() => !this.state.isLoading && this.plusImgIdx(-1)}>&#10094;</span>
        <span className="next" onClick={() => !this.state.isLoading && this.plusImgIdx(1)}>&#10095;</span>
      </React.Fragment>
    );
  }

  renderGreetingForm() {
    return (
      <form className="greeting-form" onSubmit={this.onSubmitHandler}>
        <ul className="tabs-view">
          <li
            className={ this.state.isUploadPage ? 'pick' : 'pick active' }
            onClick={() => !this.state.isLoading && this.setState({ isUploadPage: false })}
          >
            挑一張照片
          </li>
          <li
            className={ this.state.isUploadPage ? 'pick active' : 'pick' }
            onClick={() => !this.state.isLoading && this.setState({ isUploadPage: true })}
          >
            上傳一張照片
          </li>
        </ul>
        <div className="slideshow-container">
          <div hidden={!this.state.isUploadPage}>{this.renderUploadImageSection()}</div>
          <div hidden={this.state.isUploadPage}>{this.renderPickImageSection()}</div>
        </div>
        <div className="greeting-message-block">
          <label className="input">
            <h2>@</h2>
            <input type="text" name="name" placeholder="姓名" onChange={this.onTextChangeHandler} required disabled={this.state.isLoading} />
          </label>
          <label className="input">
            <textarea name="greetings" placeholder="祝賀詞" onChange={this.onTextChangeHandler} required disabled={this.state.isLoading} />
          </label>
        </div>
        <button className="btn" type="submit" disabled={this.state.isLoading}>
          {this.state.isLoading && <img className="loading-img" src={loadingIcon} alt="" />}
          留言
        </button>
        <a className="link orange-font" href={this.getUpperUrl()}>去照片牆瞧瞧</a>
      </form>
    );
  }

  render() {
    return (
      <div className="greeting">
        <header className="greeting-header">
          <h1 className="greeting-title orange-font">祝福留言版</h1>
        </header>
        {!this.state.modalDisplay && this.renderGreetingForm()}
        <Dialog user={this.getFormData()} show={this.state.modalDisplay} />
      </div>
    );
  }
}

export default Greeting;
