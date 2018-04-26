import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import {withAuth} from '../common/Auth'

import YouTube from 'react-youtube'

const createElement = React.createElement
const ReactMarkdown = require('react-markdown')
function getCoreProps(props) {
  return props['data-sourcepos'] ? {'data-sourcepos': props['data-sourcepos']} : {}
}
function Heading(props) {
  // console.log('props', props);
  let coreProps = getCoreProps(props);
  if(props.level <= 4 && !coreProps.id && props.children && props.children.length){
    coreProps.id = slugify(props.children[0].toString());
  }
  return createElement(`h${props.level}`, coreProps, props.children)
}
function slugify(string){
  return string.toLowerCase()
  .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
  .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
  .replace(/^-+|-+$/g, ''); // remove leading, trailing -
}
let renderers = {
  heading: Heading
}

class HelpComponent extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
  }

  render() {

    let menu1 = `
- [Technical Roadmap](#technical-roadmap)  
- [Team](#team)  
- [History](#history)  
- [Contact](#contact)  

    `;

//     let md1 = `
// ---- 
// `;
    let md2 = `

### Technical Roadmap 

Second aims to be a personalized AI, acting as your middleman/negotiator/guardian whenever you want to view or exchange data. For example, if you want to see photos from friends, your Second fetches all the data from disparate sources and displays photos to you, in whichever format you prefer (list, album, etc). 

In order to provide a personalized experience, your AI needs to know everything about you, and with that level of trust, you should be in complete control of the AI. This is the roadmap to building that AI.  

1. __Simple building blocks__  
Foundation for a "communication OS" that is infinitely upgradeable and can handle any data  
1. __Collaboration and communication__  
Tooling for sharing apps and data and collaborative improvement of underlying infrastructure  
1. __Personalization__  
Consumerization of apps and sharing   
1. __Bigger and Better Datasets__  
Public and private datastores grow with more precise and varied data   
1. __Better AI__  
Improved ML algorithms working on better data, user-owned and controlled  


#### Stage 1 (Foundation) 

~~New filesystem (node = file+directory+validation)~~  
~~New routing layer~~  
~~Multi-platform support (cloud, browser, iOS/Android, RPi3)~~  


#### Stage 2 (App Platform) 

~~Cloud Default App~~  
~~Browser app: app store and editor~~  
Browser/Mobile apps: social sharing (private, customizable twitter/fb)  
Browser/Mobile/IoT apps: automation  
Mobile/Iot development guides  


#### Stage 3 (Scalability and Adoption) 

Platform change support (platform-as-upgradeable)  
Security reviews  





### Team 

We're a small team with great advisors, based in San Francisco. 


### History 

We began working on the idea for Second in 2013. In early 2018 alpha software was released with the core concepts and fundamentals (identity, language, hosting). 


### Contact 

Requests may be directed to nick@getasecond.com 


---- 

Icon created by iconomania from Noun Project

----  



`;

    return (
      <div className="container">
        {/*
        <div className="content">
          <ReactMarkdown source={md1} />
        </div>
        */}
        <div className="columns">
          <div className="column is-3">
            <div className="content">
              <ReactMarkdown source={menu1} />
            </div>
          </div>
          <div className="column is-9">
            <div className="content">
              <ReactMarkdown source={md2} renderers={renderers} />
            </div>
          </div>
        </div>
      </div>
    )

    
  }
}

HelpComponent = withAuth(HelpComponent);

export default HelpComponent;
