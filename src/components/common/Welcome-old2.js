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
      <section className="hero is-medium is-default is-bold">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="columns is-vcentered">

              <div className="column is-offset-3 is-6 has-text-center">


                <h3 className="title is-3">
                  Build your Army of Seconds
                </h3>

                <h3 className="subtitle is-5">
                  Instantly deploy personal, connected apps<br /> to mobile, web, and IoT devices
                  <br />
                  <span style={{fontSize:'14px'}}>* no programming knowledge required! </span>
                </h3>

                {/*
                <h3 className="subtitle is-3">
                  Code Collaboration and Deployment Platform 
                </h3>

                <h3 className="subtitle is-5">
                  Easiest collaboration and fastest deployment to cloud, mobile, and IoT 
                </h3>
                <h3 className="subtitle is-5">
                  Run a Second as a smart assistant, e-commerce storefront, social media helper, mobile app, and more! 
                </h3>

                {/*
                
                - follow a few restrictions: faster and more understandable development process 
                - for deploying anywhere 

                Answering the question of: "where do I run this code?" 
                - for developers first, then eventually non-devs

                Ultimate Code Collaboration
                Common target runtime, 


                no more "install" step 

                Second makes it easy to share, use, and improve on code. Run in the cloud, as a browser or mobile app, or on IoT devices. 

                <h3 className="subtitle is-3">
                  Software is eating the world. 
                  <br />
                  Get your piece of the pie! 
                </h3>

                <h3 className="subtitle is-5">
                  Second is the software host for everyone in the world
                  <br />
                  (no programming knowledge required)
                  {/*Custom, user-owned "bots" that can be deployed anywhere, by anyone *}
                </h3>
                <h3 className="subtitle is-5">
                  Run a Second as a smart assistant, e-commerce storefront, social media helper, mobile app, and more! 
                </h3>

                <p>
                  Second makes it possible for any person or business in the world to easily host, manage, and improve upon complex, personalized software. It makes "install" and "upgrade" easy as pie! 
                </p>

                <p>
                  Second is a PaaS (AWS/Heroku) for everywhere, for everyone (no coding required). It simplifies the most complex part of software distribution: "install" and "upgrade" is just clicking a button 
                </p>

                */}



                {/*
                <h3 className="subtitle is-3">
                  Custom Apps for Everyone 
                </h3>

                <h3 className="subtitle is-5">
                  Easily take a code template from our marketplace and deploy your own smart assistant, e-commerce storefront, photo sharing app, and more! Code is vetted for security. 
                </h3>

                <h3 className="subtitle is-5">
                  Create an app that runs in the cloud, as a mobile app, or on an embedded device. Second makes sharing and installing as simple as possible. 
                </h3>

                <h3 className="subtitle is-5">
                  Make it easier for everyday internet users to own their data and the code powering their interactions. Custom websites, custom apps, custom devices...custom software everywhere. 
                </h3>
                */}

                {/*
                <p>
                  Deploy code to the cloud, browser, mobile app, or embedded device. 
                  As easy as possible to deploy custom software, even for non-technical users. Common I/O language, runtime environment, storage 
                  Second is a multi-environment platform for deploying code. 
                  Bundles together all the important bits for non-technical folks to deploy software: multi-platform, simple to understand and install, infinitely extensible, distributed, identity and connection/addressing, "frontend" and "backend" separation.
                </p>
              */}

                {/*
                  multi-environment Platform-as-a-Service
                */}

                {/*
                <h3 className="subtitle is-5">
                  Create complex interactions for everyone in the world to use! 
                </h3>
                */}

                {/*
                <h3 className="subtitle is-3">
                  Unified Platform for Communication
                </h3>

                <h3 className="subtitle is-5">
                  Develop apps for a consistent environment on web, mobile, and embedded devices. Share code snippets and UI elements on our public Code Store. 
                </h3>

                <h3 className="subtitle is-5">
                  Create complex interactions for everyone in the world to use! 
                </h3>
                */}

              </div>

            </div>
          </div>
        </div>

        {/*
        <div className="hero-foot">
          <div className="container">
            <div className="tabs is-centered">
              <ul>
                <li><a href="#about"><span className="icon is-large"><i className="fa fa-angle-down fa-3x"></i></span></a></li>
              </ul>
            </div>
          </div>
        </div>
        */}
      </section>
      ,
      <section id="about" className="hero is-medium is-info">
        <div className="hero-body">
          <div className="container has-text-centered">
            {/*
            <div className="columns">
              <div className="column is-12">
                <h3 className="title is-2">
                  Get Started
                </h3>
              </div>
            </div>
            */}
            <div className="columns">

              <div className="column is-4">

                <h3 className="title is-4">
                  Step 1
                </h3>
                <h3 className="subtitle is-4">
                  Find an App
                </h3>

                <div className="content has-text-left">

                  <p>
                    Search the App Store all kinds of apps 
                  </p>

                </div>

              </div>

              <div className="column is-4">

                <h3 className="title is-4">
                  Step 2
                </h3>
                <h3 className="subtitle is-4">
                  Setup Environment
                </h3>


                <div className="content has-text-left">

                  <p>
                    Run on your own hardware, or purchase shared space. Instantly deploy to the environmentweb window, mobile app, cloud server 
                  </p>

                </div>

              </div>

              <div className="column is-4">

                <h3 className="title is-4">
                  Step 3
                </h3>
                <h3 className="subtitle is-4">
                  Deploy and Customize
                </h3>

                <div className="content has-text-left">

                  <p>
                    Get instant help, with easy-to-deploy improvements and live collaboration. 
                  </p>

                </div>

              </div>
            </div>
          </div>
        </div>

      </section>
      ,
      <section id="about" className="hero is-medium is-success">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="columns">
              <div className="column is-12">
                <h3 className="title is-2">
                  Second Network
                </h3>
              </div>
            </div>
            <div className="columns">

              <div className="column is-4">

                <h3 className="title is-4">
                  Private Databases
                </h3>

                <div className="content has-text-left">

                  <p>
                    ...
                  </p>

                </div>

              </div>

              <div className="column is-4">

                <h3 className="title is-4">
                  Private/Public Databases
                </h3>

                <div className="content has-text-left">

                  <p>
                    ...
                  </p>

                </div>

              </div>

              <div className="column is-4">

                <h3 className="title is-4">
                  Public Databases
                </h3>

                <div className="content has-text-left">

                  <p>
                    ...
                  </p>

                </div>

              </div>

            </div>
          </div>
        </div>

      </section>
      ,
      <section id="about" className="hero is-medium is-info">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="columns">
              <div className="column is-12">
                <h3 className="title is-2">
                  Second Puts You in Control
                </h3>
              </div>
            </div>
            <div className="columns">

              <div className="column is-4">

                <h3 className="title is-4">
                  Connections
                </h3>

                <div className="content has-text-left">

                  <p>
                    Each Second has a unique identity (public/private keypair) and can "talk" to any other Second. Identity is also stored on the blockchain, so finding, connecting to, and verifying a Second is uncensorable, yet simple for humans to say "connect to xyz Second" and trust it is secure. 
                  </p>

                  <br />

                  <p>
                    This enables you to: 
                  </p>
                  <p>
                    Own your Social Graph. 
                  </p>
                  <p>
                    Connect to friends, business, and devices
                  </p>
                  <p>
                    Share information ("photos I have access to") and make requests ("turn the tv on") 
                  </p>
                  <p>
                    Build reputation graphs and recommendation systems from provable transactions linked to identities 
                  </p>
                  <p>
                    No Spam. Each Second has an identity that can be verified, and initial connections use a hashcash algorithm to make spamming unprofitable. 
                  </p>

                </div>

              </div>

              <div className="column is-4">

                <h3 className="title is-4">
                  Personal Data
                </h3>


                <div className="content has-text-left">

                  <p>
                    Second has a simple system of storing and fetching information, and providing permissions for how other Seconds can access your data. 
                  </p>
                  <p>
                    Human-understandable permissions that can be setup through commands such as "photos I tag 'family' should be available to family members" 
                  </p>
                  <p>
                    All data is "typed" and has a schema it must conform to. Each piece of data can also point to any other piece of data (edges and nodes in a graph database). 
                  </p>

                </div>

              </div>

              <div className="column is-4">

                <h3 className="title is-4">
                  Interactions
                </h3>

                <div className="content has-text-left">

                  <p>
                    No Ads. Your Second has complete control over the interface displayed to you, and because all data is strictly typed and can be verified.
                  </p>
                  <p>
                    Second understands the context for inputs, so can provide correct outputs (i.e. If you are on a device with no UI, it can speak results) 
                  </p>
                  <p>
                    You can choose how to view the data in your Second, or fetched from other Seconds. Switching between viewing photos in a list versus an album view is simple
                  </p>
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
