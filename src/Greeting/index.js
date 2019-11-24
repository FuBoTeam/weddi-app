import React, { Component } from 'react';
import range from 'lodash/range';
import './greeting.css';

import Configs from '../configs';
import { combinationList } from '../utils/random';
import { getImageUrl } from '../images';
import Dialog from '../Board/Dialog';

import Api from '../api';

class Greeting extends Component {
  allImgUrls = range(Configs.img.totalImgs).map(k => getImageUrl(k));
  fmImgsShouldBePicked = Configs.img.fmImgsShouldBePicked;
  imgUrls = combinationList(this.allImgUrls, this.fmImgsShouldBePicked);

  state = {
    form: {
      name: '',
      greetings: '',
      imgPicked: 0,
      file: '',
    },
    upload: false,
    modalDisplay: false,
  };

  onFileChangeHandler = this.onFileChangeHandler.bind(this);
  onTextChangeHandler = this.onTextChangeHandler.bind(this);
  onSubmitHandler = this.onSubmitHandler.bind(this);
  isValid = this.isValid.bind(this);
  setImgIdx = this.setImgIdx.bind(this);
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
      imgUrl: this.imgUrls[this.state.form.imgPicked],
    };
  }

  onFileChangeHandler(event) {
    const key = event.target.name;
    const value = URL.createObjectURL(event.target.files[0]);
    this.setState(({ form }) => ({ form: { ...form, [key]: value } }))
  }

  onTextChangeHandler(event) {
    const key = event.target.name;
    const value = event.target.value.trim();
    this.setState(({ form }) => ({ form: { ...form, [key]: value } }));
  }

  onSubmitHandler(event) {
    event.preventDefault();
    if (this.isValid()) {
      return Api.writePost(this.getFormData()).then(() => {
        this.setState({ modalDisplay: true });
        setTimeout(() => { this.props.history.push(this.getUpperUrl()); }, 3000);
      });
    }
  }

  setImgIdx(imgPicked) {
    this.setState(({ form }) => ({ form: { ...form, imgPicked } }));
  }

  plusImgIdx(i) {
    const nextIdx = (this.state.form.imgPicked + i + this.fmImgsShouldBePicked) % this.fmImgsShouldBePicked;
    this.setImgIdx(nextIdx);
  }

  isValid() {
    const { name, greetings, imgPicked } = this.state.form;
    return name.trim() !== '' && greetings.trim() !== '' && imgPicked !== undefined;
  }

  renderPhotoRadios = () => this.imgUrls.map((url, i) => {
    const checked = this.state.form.imgPicked === i;
    return (
      <React.Fragment key={`image_${i}`}>
        <input className="hidden" type="radio" name="imgUrl" value={url} checked={checked} readOnly />
        <img className={"fade" + (checked ? "" : " hidden")} src={url} alt={url} />
      </React.Fragment>
    );
  });

  renderUploadImageSection() {
    return (
      <div className="img-window">
        <input className="numbertext" type="file" name="upload" placeholder="上傳照片" accept="image/*" onChange={this.onFileChangeHandler} />
        <img style={{width: '100%', height: '243px'}} src={this.state.form.upload} alt="upload preview" />
      </div>
    );
  }

  renderPickImageSection() {
    return (
      <React.Fragment>
        <div className="img-window">
          <div className="numbertext">{this.state.form.imgPicked + 1} / {this.fmImgsShouldBePicked}</div>
          {this.renderPhotoRadios()}
        </div>
        <a className="prev" onClick={() => this.plusImgIdx(-1)}>&#10094;</a>
        <a className="next" onClick={() => this.plusImgIdx( 1)}>&#10095;</a>
      </React.Fragment>
    );
  }

  renderGreetingForm() {
    return (
      <form className="greeting-form" onSubmit={this.onSubmitHandler}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label className="pick" onClick={() => this.setState({ upload: false })}>挑一張照片</label>
          <label className="pick" onClick={() => this.setState({ upload: true })}>上傳一張照片</label>
        </div>
        <div className="slideshow-container">
          {this.state.upload ? this.renderUploadImageSection() : this.renderPickImageSection()}
        </div>
        <div className="greeting-message-block">
          <label className="input"><h2>@</h2><input type="text" name="name" placeholder="姓名" onChange={this.onTextChangeHandler} required /></label>
          <label className="input"><textarea name="greetings" placeholder="祝賀詞" onChange={this.onTextChangeHandler} required /></label>
        </div>
        <input className="btn" type="submit" value="留言" />
        <a className="link" href={this.getUpperUrl()}>去照片牆瞧瞧</a>
      </form>
    );
  }

  render() {
    return (
      <div className="greeting">
        <header className="greeting-header">
          <h1 className="greeting-title">祝福留言版</h1>
        </header>
        {!this.state.modalDisplay && this.renderGreetingForm()}
        <Dialog user={this.getFormData()} show={this.state.modalDisplay} />
      </div>
    );
  }
}

export default Greeting;
