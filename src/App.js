import React, { Component } from 'react';
import './App.css';

import { combination } from './utils/random';
import { getImageUrl } from './images';

const TOTAL_IMGS = 114;
const IMGS_SHOULD_BE_PICKED = 5;

class App extends Component {
  constructor() {
    super();
    const imageKeys = combination(TOTAL_IMGS, IMGS_SHOULD_BE_PICKED);
    this.state = {
      imageKeys,
      form: {
        name: '',
        greetings: '',
        imgUrl: ''
      }
    };
    this.onTextChangeHandler = this.onTextChangeHandler.bind(this);
  }

  onTextChangeHandler(event) {
    event.preventDefault();
    const key = event.target.name;
    const value = event.target.value.trim();
    this.setState(state => ({...state, form: {...state.form, [key]: value}}));
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
        <form>
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
