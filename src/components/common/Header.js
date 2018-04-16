import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import {withAuth} from './Auth'

class HeaderComponent extends Component {
  constructor(props){
    super(props)
    this.state = {};
  }

  render(){

    let user = this.props.auth.user;

    let links = [];

    // links.push({
    //   to: '/market',
    //   text: 'App Store'
    // })

    // links.push({
    //   to: '/directories',
    //   text: 'Directories'
    // })


    // links.push({
    //   to: '/nodes',
    //   text: 'NodeChain'
    // })


    // links.push({
    //   to: '/keys',
    //   text: 'Keys'
    // })

    // links.push({
    //   to: '/language',
    //   text: 'Language/DataTypes'
    // })

    // links.push({
    //   to: '/nodes',
    //   text: 'Unique Nodes'
    // })

    links.push({
      to: '/',
      text: 'Home'
    })

    links.push({
      to: '/about',
      text: 'About'
    })

    links.push({
      to: '/developers',
      text: 'Developers'
    })


    // links.push({
    //   to: '/identity',
    //   text: 'Identities'
    // })

    // console.log('AUTH USER:', user);


    return (
      <div className="container">
        <br />
        <div className="links">
          {
            links.map((link,i)=>(
              <Link className="" to={link.to} key={i}>
                {link.text}
              </Link>
            )).reduce((prev, curr, i) => [prev, <span key={i+10}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>, curr])
          }
        </div>
        <hr />
      </div>
    )
  }
};

HeaderComponent = withAuth(HeaderComponent);

export default HeaderComponent;
