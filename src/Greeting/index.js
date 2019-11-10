import React, { Component } from 'react';
import range from 'lodash/range';
import './greeting.css';

import Configs from '../configs';
import { combinationList } from '../utils/random';
import { getImageUrl } from '../images';
import Dialog from '../Board/Dialog';

import Api from '../api';

class Greeting extends Component {
  allImgUrls = range(Configs.getImgConfig().totalImgs).map(k => getImageUrl(k));
  fmImgsShouldBePicked = Configs.getImgConfig().fmImgsShouldBePicked;
  imgUrls = combinationList(this.allImgUrls, this.fmImgsShouldBePicked);

  state = {
    form: {
      name: '',
      greetings: '',
      imgPicked: 0,
    },
    modalDisplay: false,
  };

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
        <label className="hidden">
          <input type="radio" name="imgUrl" value={url} checked={checked} readOnly />
        </label>
        <img className={"fade" + (checked ? "" : " hidden")} src={url} alt={url} />
      </React.Fragment>
    );
  });

  render() {
    return (
      <div className="greeting">
        <header className="greeting-header">
          <h1 className="greeting-title">祝福留言版</h1>
        </header>
        {
          !this.state.modalDisplay && (
            <form className="greeting-form" onSubmit={this.onSubmitHandler}>
              <label className="pick">挑一張照片</label>
              <div className="slideshow-container">
                <div className="img-window">
                  <div className="numbertext">{this.state.form.imgPicked + 1} / {this.fmImgsShouldBePicked}</div>
                  {this.renderPhotoRadios()}
                </div>
                <a className="prev" onClick={() => this.plusImgIdx(-1)}>&#10094;</a>
                <a className="next" onClick={() => this.plusImgIdx( 1)}>&#10095;</a>
              </div>
              <div className="greeting-message-block">
                <label className="input"><h2>@</h2><input type="text" name="name" placeholder="姓名" onChange={this.onTextChangeHandler} required /></label>
                <label className="input"><textarea name="greetings" placeholder="祝賀詞" onChange={this.onTextChangeHandler} required /></label>
              </div>
              <input className="btn" type="submit" value="留言" />
              <a className="link" href={this.getUpperUrl()}>去照片牆瞧瞧</a>
            </form>
          )
        }
        <Dialog user={this.getFormData()} show={this.state.modalDisplay} />
      </div>
    );
  }
}

export default Greeting;
