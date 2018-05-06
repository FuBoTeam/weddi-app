import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isValidate: false,
      form: {
        name: undefined,
        greetings: undefined,
        imgUrl: undefined,
      }
    };
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Greetings</h1>
        </header>
        <form>
          <label> Name <input type="text" name="name" required /></label><br />
          <label> Greetings <input type="text" name="greetings" required /></label><br />
          <div>
          Picture
            <label>
              <input type="radio" name="imgUrl" value="https://storage.googleapis.com/wedding_iota/13_small.jpg" required />
              <img style={{height: '150px'}} src="https://storage.googleapis.com/wedding_iota/13_small.jpg" />
            </label>
            <label>
              <input type="radio" name="imgUrl" value="https://storage.googleapis.com/wedding_iota/13_small.jpg" required />
              <img style={{height: '150px'}} src="https://storage.googleapis.com/wedding_iota/20_small.jpg" />
            </label>
            <label>
              <input type="radio" name="imgUrl" value="https://storage.googleapis.com/wedding_iota/13_small.jpg" required />
              <img style={{height: '150px'}} src="https://storage.googleapis.com/wedding_iota/50_small.jpg" />
            </label>
            <label>
              <input type="radio" name="imgUrl" value="https://storage.googleapis.com/wedding_iota/13_small.jpg" required />
              <img style={{height: '150px'}} src="https://storage.googleapis.com/wedding_iota/80_small.jpg" />
            </label>
            <label>
              <input type="radio" name="imgUrl" value="https://storage.googleapis.com/wedding_iota/13_small.jpg" required />
              <img style={{height: '150px'}} src="https://storage.googleapis.com/wedding_iota/0_small.jpg" />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default App;
