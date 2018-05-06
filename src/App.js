import React, { Component } from 'react';
import './App.css';

import { combination } from './utils/random';
import { getImageUrl } from './images';

const TOTAL_IMGS = 84;
const IMGS_SHOULD_BE_PICKED = 5;

class App extends Component {
  constructor() {
    super();
    const imageKeys = combination(TOTAL_IMGS, IMGS_SHOULD_BE_PICKED);
    this.state = {
      imageKeys,
      form: {
        isValidate: false,
        name: undefined,
        greetings: undefined,
        imgUrl: undefined,
      }
    };
  }
  render() {
    const images = this.state.imageKeys.map(key => getImageUrl(key));
    const picRadios = images.map((url, i) => (
      <label key={i}>
        <input type="radio" name="imgUrl" value={url} required />
        <img style={{height: '150px'}} src={url} alt={url} />
      </label>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Greetings</h1>
        </header>
        <form>
          <label> Name <input type="text" name="name" required /></label><br />
          <label> Greetings <input type="text" name="greetings" required /></label><br />
          <div> Picture {picRadios}</div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default App;
