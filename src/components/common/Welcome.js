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

                <br />

                <h3 className="subtitle is-5">
                  Own your <span style={{fontWeight:'bold'}}>identity</span>, 
                  <br />
                  protect and share your <span style={{fontWeight:'bold'}}>data</span>, 
                  <br />
                  and take control over your <span style={{fontWeight:'bold'}}>UX</span>. 
                </h3>

                <br />

              </div>
            </div>

            <div className="columns is-vcentered">

              <div className="column is-6 has-text-center">


                <YouTube
                  videoId="RVRCsuoHmak"
                  opts={{
                    height: '315',
                    width: '560',
                    playerVars: {
                      allowfullscreen: 1,
                      showinfo: 0
                    }
                  }}
                />

                <h3 className="subtitle is-6">
                  Technical Overview Video
                </h3>


              </div>

              <div className="column is-6 has-text-center">


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

                <h3 className="subtitle is-6">
                  Second v0.1 Walkthrough 
                </h3>

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
                Personal Data
              </h3>


              <div className="content has-text-left">

                <p>
                  Second has a simple system of storing and fetching information, and providing permissions for how other Seconds can access your data. 
                </p>

              </div>

            </div>

            <div className="column is-4">

              <h3 className="title is-4">
                Connections
              </h3>

              <div className="content has-text-left">

                <p>
                  Each Second has a unique username that is stored on the Stellar platform, and can discover and communicate with other Seconds. Different actions and data are available based on permissions you setup. 
                </p>

              </div>

            </div>

            <div className="column is-4">

              <h3 className="title is-4">
                Custom UX 
              </h3>

              <div className="content has-text-left">

                <p>
                  Launch a custom Browser Second for managing your remote Second, or create single-purpose apps (for browser or mobile) that have limited permissions and also talk to your Second. For example: you can have a custom Android app for displaying lists of information. 
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
                  1. Setup Cloud Second  
                </h3>
                <h3 className="subtitle is-6">
                  Choose a username and deploy instantly to Heroku, DO, AWS, or your own infrastructure 
                </h3>

                <br />

                <h3 className="title is-4">
                  2. Connect from Browser App 
                </h3>
                <h3 className="subtitle is-6">
                  Connect to your Cloud Second using your username to view data and capabilities
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

            {/*
            <p className="has-text-centered">
              <Link to="/cloud" className="button is-primary">Setup my Cloud Second</Link>
            </p>
            */}

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
