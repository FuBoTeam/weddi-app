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
      return Api.writePost(this.state.form);
    }
  }

  isValid() {
    const { name, greetings, imgUrl } = this.state.form;
    return name.trim() !== '' && greetings.trim() !== '' && imgUrl.trim() !== '';
  }

  render() {
    const images = this.state.imageKeys.map(key => getImageUrl(key));
    const picRadios = images.map((url, i) => {
      let checked;
      if (this.state.form.imgUrl === '') {
        checked = i === 0;
      } else {
        checked = this.state.form.imgUrl === url;
      }
      const style = checked ?
        { height: '150px', border: '1px solid' } :
        { height: '150px', border: '1px solid transparent' };
      return (
        <label key={i}>
          <input style={{display: 'none'}} type="radio" name="imgUrl" value={url}
            onChange={this.onTextChangeHandler} required checked={checked} />
          <img style={style} src={url} alt={url} />
        </label>
      );
    });
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Greetings</h1>
        </header>
        <form onSubmit={this.onSubmitHandler}>
          <label> Name <input type="text" name="name" onChange={this.onTextChangeHandler} required /></label>
          <br />
          <label> Greetings <textarea name="greetings" onChange={this.onTextChangeHandler} required /></label>
          <br />
          <div> Picture {picRadios}</div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
