import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import {withAuth} from '../common/Auth'

import YouTube from 'react-youtube'

const ReactMarkdown = require('react-markdown')


class HelpComponent extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
  }

  render() {

    let md1 = `


### Team 

We're a small team with great advisors, based in San Francisco. 


### History 

Nick began working on the idea for Second in 2013. In early 2018 alpha software was released with the core concepts and fundamentals (identity, language, hosting). 


### Contact 

Requests may be directed to nicholas.a.reed at gmail 


---- 

Icon created by iconomania from Noun Project

    `


    return (
      <div className="container">
        <div className="content">
          <ReactMarkdown source={md1} />
        </div>
      </div>
    )

    
  }
}

HelpComponent = withAuth(HelpComponent);

export default HelpComponent;
