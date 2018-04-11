import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import {withAuth} from '../common/Auth'

import YouTube from 'react-youtube'

const ReactMarkdown = require('react-markdown')


class WelcomeComponent extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
  }

  render() {

    let md1 = `
### Welcome to Second 

We're building a platform to __easily create and share personal apps and data__. Easy like customizing-your-myspace-page easy. 

---- 

Second combines development, hosting, and distribution into a single platform that you run on your own server. It is useful to think of it as __your personal App and Data Store that travels with you__. It is _entirely decentralized_ and made up of a few key components: 

_Usernames_  
The routing/identity/config layer is stored on the blockchain (the Stellar network). This enables "pretty" usernames to be permanently owned and controlled by a user or organization (cannot be siezed or MITM'd). 

_Data_  
A simple and expressive data structure is used to store and transfer all information: every file is also a directory, and the file's type defines a schema stored on IPFS. When exchanging data between Apps, the file's type is used to define how to handle its data. Data can be stored in a nicely-querable form inside a Second, or on shared NodeDBs that are permissioned and replicated. 

_Platforms_  
Deployment to any platform (cloud, browser, mobile, IoT) of a new or updated app is instant, and you completely control what goes into your personal App Store. 

&nbsp;

#### Alpha Walkthru Video 
    `

let md2 = `

----

#### What's Next? 

We have ambitious plans for Second and would love your input! We need help writing documentation, improving scalability and security, and building sample apps for anyone to clone. 

Contact nicholas.a.reed at gmail if you are interested in contributing. You can also [launch your own Second](/cloud) today.  

&nbsp;
&nbsp;


`;

    return (
      <div className="container">
        <div className="content">
          <ReactMarkdown source={md1} />
          <YouTube
            videoId="JYsPARxV09M"
            opts={{
              height: '315',
              width: '560',
              playerVars: {
                allowfullscreen: 1,
                showinfo: 0
              }
            }}
          />
          <ReactMarkdown source={md2} />
        </div>
      </div>
    )

    
  }
}

WelcomeComponent = withAuth(WelcomeComponent);

export default WelcomeComponent;
