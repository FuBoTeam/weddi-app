import React, { Component } from 'react';
import './App.css';

import { TOTAL_IMGS, FM_IMGS_SHOULD_BE_PICKED } from './configs';
import { combination } from './utils/random';
import { getImageUrl } from './images';

import Api from './api';

class App extends Component {
  constructor() {
    super();
    const imageKeys = combination(TOTAL_IMGS, FM_IMGS_SHOULD_BE_PICKED);
    const defaultImgUrl = getImageUrl(imageKeys[0]);
    this.state = {
      imageKeys,
      form: {
        name: '',
        greetings: '',
        imgUrl: defaultImgUrl,
      },
    };
    this.onTextChangeHandler = this.onTextChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  onTextChangeHandler(event) {
    event.preventDefault();
    const key = event.target.name;
    const value = event.target.value.trim();
    this.setState(state => ({...state, form: {...state.form, [key]: value}}));
  }

  onSubmitHandler(event) {
    event.preventDefault();
    if (this.isValid()) {
      return Api.writePost(this.state.form).then(() => {
        document.location.href = `${document.location.href}?v=dashboard`;
      });
    }
  }

  isValid() {
    const { name, greetings, imgUrl } = this.state.form;
    return name.trim() !== '' && greetings.trim() !== '' && imgUrl.trim() !== '';
  }

  render() {
    const images = this.state.imageKeys.map(key => getImageUrl(key));
    const picRadios = images.map((url, i) => {
      const checked = this.state.form.imgUrl === url;
      const style = checked ?
        { border: '3px solid white' } :
        { border: '3px solid transparent', opacity: '0.5' };
      return (
        <label key={i}>
          <input style={{display: 'none'}} type="radio" name="imgUrl" value={url}
            onChange={this.onTextChangeHandler} required checked={checked} />
          <img className="img-choice" style={style} src={url} alt={url} />
        </label>
      );
    });
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Greetings</h1>
        </header>
        <form className="App-form" onSubmit={this.onSubmitHandler}>
          <label className="pick">Pick 1 Photo</label>
          <div>{picRadios}</div>
          <div className="App-message-block">
            <label className="input"><h2>@</h2><input type="text" name="name" placeholder="Name" onChange={this.onTextChangeHandler} required /></label>
            <label className="input"><textarea name="greetings" placeholder="Greetings" onChange={this.onTextChangeHandler} required /></label>
          </div>
          <input className="btn" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
