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


    links.push({
      to: '/nodes',
      text: 'NodeChain'
    })


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
      to: '/about',
      text: 'About'
    })

    // links.push({
    //   to: '/identity',
    //   text: 'Identities'
    // })

    // console.log('AUTH USER:', user);


    return (
      <nav className="navbar is-transparent">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <strong>Second</strong>
          </a>

          <div className="navbar-burger burger" data-target="navMenuTransparentExample" onClick={e=>this.setState({menuActive:!this.state.menuActive})}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navMenuTransparentExample" className={"navbar-menu " + (this.state.menuActive ? 'is-active':'')} onClick={e=>this.setState({menuActive:false})}>
          <div className="navbar-start">
            {
              links.map((link,i)=>(
                <Link className="navbar-item" to={link.to} key={i}>
                  {link.text}
                </Link>
              ))
            }
          </div>


          <div className="navbar-end">

            {/*
              user ? 
                <div className="navbar-item has-dropdown is-hoverable">
                  <a className="navbar-link">
                    {user.username}
                  </a>

                  <div className="navbar-dropdown is-right">

                    <Link to="/settings" className="navbar-item">
                      Settings
                    </Link>

                    <div className="navbar-divider"></div>

                    <a href={process.env.REACT_APP_LOGOUT_URL} className="navbar-item">
                      Logout
                    </a>


                  </div>
                </div>
              :
                <a className="navbar-item" href={process.env.REACT_APP_LOGIN_URL + '?return=' + window.location.href}>
                  Login
                </a>
            */}


          </div>

        </div>
      </nav>
    )
  }
};

HeaderComponent = withAuth(HeaderComponent);

export default HeaderComponent;
