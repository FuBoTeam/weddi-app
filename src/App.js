import React, { Component } from 'react';
import './App.css';

import { getImageUrl } from './images';

class App extends Component {
  constructor() {
    super();
    this.state = {
      form: {
        isValidate: false,
        name: undefined,
        greetings: undefined,
        imgUrl: undefined,
      }
    };
  }
  render() {
    const images = [getImageUrl(13), getImageUrl(20), getImageUrl(50), getImageUrl(80), getImageUrl(1)];
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
