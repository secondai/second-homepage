import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import {withAuth} from '../common/Auth'

import YouTube from 'react-youtube'


class WelcomeComponent extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
  }

  render() {

    return [
      <section key={1} className="hero is-medium2">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="columns is-vcentered">

              <div className="column is-offset-3 is-6 has-text-center">

                <h3 className="title is-1">
                  Second
                </h3>

                <h3 className="subtitle is-3">
                  Personal App Store and Hosting Platform
                </h3>

                <br />

              </div>
            </div>

            <div className="columns is-vcentered">

              <div className="column is-12 has-text-center">

                <YouTube
                  videoId="w4SUaWFHoog"
                  opts={{
                    height: '315',
                    width: '560',
                    playerVars: {
                      allowfullscreen: 1,
                      showinfo: 0
                    }
                  }}
                />

              </div>
            </div>

            <div className="columns is-vcentered">

              <div className="column is-offset-3 is-6 has-text-center">

                {/*
                <br />
                
                <p className="">
                  <Link to="/" className="button is-primary">Setup my Cloud Second</Link>
                </p>
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
      <section key={2} id="about">
        <div className="container has-text-centered">
          <div className="columns">

            <div className="column is-4">

              <h3 className="title is-4">
                Build Apps Fast, Distribute Instantly 
              </h3>


              <div className="content has-text-left">

                <p>
                  Connect to any Second to clone an app, then make changes, and instantly distribute the updated app from your own store. 
                </p>

              </div>

            </div>

            <div className="column is-4">

              <h3 className="title is-4">
                Personalized UIs Everywhere
              </h3>

              <div className="content has-text-left">

                <p>
                  Every UI is run through your App Store, so you can easily modify any interfaces to fit your exact needs. This works for browsers, mobile, IoT devices, etc. 
                </p>

              </div>

            </div>

            <div className="column is-4">

              <h3 className="title is-4">
                Own and Control Everything
              </h3>

              <div className="content has-text-left">

                <p>
                  From your username to where you host your Second and all your data, Second has a user-first architecture that is built on decentralization technologies like the blockchain and IPFS. 
                </p>

              </div>

            </div>
          </div>
        </div>
      </section>
      ,
      <section key={3} className="hero is-medium is-default is-bold">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="columns is-vcentered">

              <div className="column is-offset-3 is-6 has-text-center">


                <h3 className="title is-3">
                  Get Started
                </h3>

                {/*
                <p>
                  <a href="/" className="button is-primary">Setup my Cloud Second</a>
                </p>
                */}

              </div>

            </div>

            <br />

            <div className="columns is-vcentered">

              <div className="column is-offset-4 is-4 has-text-left">

                <h3 className="title is-4">
                  1. Setup your Second  
                </h3>
                <h3 className="subtitle is-6">
                  Choose a username and deploy instantly to Heroku, DO, AWS, or your own infrastructure 
                </h3>

                <br />

                <h3 className="title is-4">
                  2. Connect from Browser 
                </h3>
                <h3 className="subtitle is-6">
                  Connect to your Second to view/install/modify apps 
                </h3>
                <br />

                <h3 className="title is-4">
                  3. Collaborate 
                </h3>
                <h3 className="subtitle is-6">
                  Update your local data from the NodeChain, and share your improved Code Nodes and new capabilities 
                </h3>


              </div>

            </div>

            <br />

            <p className="has-text-centered">
              <Link to="/about" className="button is-info">Contribute</Link>
              &nbsp;
              <Link to="/cloud" className="button is-primary">Setup PoC Cloud Second</Link>
            </p>

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
      </section>,
      <footer key={4} className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              <strong>Second</strong> by <a href="https://getasecond.com">Nicholas Reed</a>. 
              <br />
              Copyright 2018. 
            </p>
          </div>
        </div>
      </footer>

    ]
  }
}

WelcomeComponent = withAuth(WelcomeComponent);

export default WelcomeComponent;
