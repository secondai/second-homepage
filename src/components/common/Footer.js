import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


class FooterComponent extends Component {
  constructor(props){
    super(props)
  }

  render(){
    return (
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              Powered by <strong>ette.work</strong>
            </p>
          </div>
        </div>
      </footer>
    )
  }
};

export default FooterComponent;
