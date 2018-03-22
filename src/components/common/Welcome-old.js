import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import {withAuth} from '../common/Auth'


class WelcomeComponent extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
  }

  @autobind
  handeLogin(e){
    e.preventDefault();

    console.log('Trying login');
    $.ajax({
      url: '/auth/login',
      method: 'POST',
      data: {
        username: 'nicholas.a.reed@gmail.com',
        password: 'test',
      },
      error: (err) => {
        console.error('Failed login auth', err);
      },
      success: (val) => {
        console.log('Auth success!', val);
      }

    })

    return false;

  }

  @autobind
  checkLogin(e){
    e.preventDefault();

    console.log('Trying login');
    $.ajax({
      url: '/auth/checklogin',
      method: 'GET',
      error: (err) => {
        console.error('Failed session return auth', err);
      },
      success: (val) => {
        console.log('VAL FROM SESSION:', val);
      }

    })

    return false;

  }

  render() {

    // fake OAuth (for now, finish later) 

    let loginUrl = process.env.REACT_APP_LOGIN_URL;

    let currentUrl = window.location.href;
    loginUrl = loginUrl + '?redirect=' + encodeURI(process.env.REACT_APP_LOGIN_RETURN_HOST);

    return [
      <section className="hero is-fullheight" key={'sec1'}>
        <div className="hero-body" style={{paddingTop:'0px',marginTop:'-40px'}}>
          <div className="container has-text-centered">
            <h1 className="title">
              The <strong>Second</strong> Web
            </h1>
            <h2 className="subtitle">
              The Smart Assistant for Everyone and Everywhere
              <br />
              Own Your Data, Own Your Future 
              <br />
              The Open "lingua franca" (bridge language) of the Future
              <br />
              Goodbye Facebook, Goodbye Google, Hello Freedom!
            </h2>

            <div className="columns is-multiline">

              <div className="column is-3">
                <div className="box">
                  Enterprise
                  <br />
                  - file organization 
                  <br />
                  - data access logs and user auth 
                </div>
              </div>

              <div className="column is-3">
                <div className="box">
                  SMB
                  <br />
                  - storefront, FAQ, menus 
                  <br />
                  - in-store experience (hotels) 
                </div>
              </div>

              <div className="column is-3">
                <div className="box">
                  Content Creators / Influencers
                  <br />
                  - designed for millions of fans 
                  <br />
                  - distribution 
                  <br />
                  - payments and subscriptions
                </div>
              </div>

              <div className="column is-3">
                <div className="box">
                  Personal Use
                  <br />
                  - notifications 
                  <br />
                  - social graph
                  <br />
                  - photo sharing
                  <br />
                  - groups 
                </div>
              </div>

              <div className="column is-3">
                <div className="box">
                  Embed in Website
                  <br />
                  - custom navigation 
                </div>
              </div>

              <div className="column is-3">
                <div className="box">
                  For Embedded Devices
                  <br />
                  - control anything
                  <br />
                  - tv, lights, etc. 
                  <br />
                  - device can be taught too (own the software on your devices!) 
                </div>
              </div>


            </div>

          </div>
        </div>
      </section>
      
    ]
  }
}

WelcomeComponent = withAuth(WelcomeComponent);

export default WelcomeComponent;
