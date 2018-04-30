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

    // We're building a platform to __easily create and share personalized apps and data__. 

// How did we get here? 

// You probably started using facebook because it was new, or because it had a good UI, or because your friends used it. Now, as the platfom makes mistakes, you can't switch because wherever you import your data would have different APIs and UIs, and none of your friends would see your new posts. This is a giant moat that facebook has built around its business to prevent competitors from existing. 


// How does Second help? 

// We see the current setup as a problem of _portability_ and _interoperability_; if it was easy to own and manage your data, identity, and connections, then when a 3rd party (facebook) lost your trust you could easily stop using them. This would incentivize 3rd parties to always act in your best interest. Second makes it easy for anyone to have this level of control over their data. 

// Second is designed to be the best programming tool ever; the framework gets rid of 95% of the obstacles new and experienced developers face when 


// Knowledge is Power. 

// Centralization of knowledge (facebook, twitter, google, et al.) leads to centralization of power. 

// Second destroys centralization, and gives power back to individuals. 

    let md1 = `
### Welcome to Second 

An internal Brain for your company. 

Replace Slack, Yammer, and all your internal knowledge-sharing apps with a simple, extendable, platform. 

Custom UIs for employees, permissioned data access, and infinitely extensible. 


---- 


&nbsp;

#### Alpha Walkthru Video 
    `

let md2 = `

----

#### What's Next? 

We have ambitious plans for Second and would love your input! We're writing documentation, improving scalability and security, and building sample apps. See our [technical roadmap](/about#technical-roadmap) or [contact us](/about#contact). 

You can also [launch your own (alpha software) Second](/cloud) today! 

&nbsp;
&nbsp;


`;

    return (
      <div className="container">
        <div className="content">
          <ReactMarkdown source={md1} />
          <YouTube
            videoId="ms5CQfdc94M"
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
