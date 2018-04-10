import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import {withAuth} from '../common/Auth'


class HelpComponent extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
  }

  render() {

    return (
      <div className="section">
        <div className="container">

          <div className="columns">
            <div className="column">

              <div className="content">

                <h3>
                  Contribute
                </h3>
                <p className="content">
                  Second is alpha-quality software. Programmers are needed for improvements to: 
                  <ul>
                    <li>
                      Security (web of trust needs mapping) 
                    </li>
                    <li>
                      Scalability (leaks memory)
                    </li>
                    <li>
                      Collaboration (easier packaging and distribution, better tooling)
                    </li>
                  </ul>
                </p>

                <p className="content">
                  Additional improvements needed or apps to be built: 
                  <ul>
                    <li>
                      OAuth with your Second (similar to OpenID) 
                    </li>
                    <li>
                      Browser that replaces domain names with usernames 
                    </li>
                    <li>
                      Dockerized for easier deployment 
                    </li>
                    <li>
                      Additional hosting targets (AWS, GCloud, etc.) 
                    </li>
                    <li>
                      NodeChain API needs permissions and management (just a PoC) 
                    </li>
                    <li>
                      Create dev template for new data types: Create, View Single, View Multiple, Edit
                    </li>
                    <li>
                      Assistant needs development pipeline for adding new contexts/inputs/actions
                    </li>
                  </ul>
                </p>

                <p className="content">
                  Start by visiting the <a href="https://github.com/secondai/welcome">Second GitHub organization home</a>. 
                  <br />Contact Nick if you have questions, or try <a href="https://reddit.com/r/programming">reddit.com/r/programming</a>. 
                </p>


                <br />

                <h3>
                  About Second
                </h3>
                <p>
                  Initial Release March 2018. Copyright Nicholas Reed. 
                </p>
                <p>
                  Icon created by iconomania from Noun Project
                </p>

                <br />

              </div>



            </div>

            <div className="column is-4">


            </div>
          </div>

        </div>

      </div>
    )
  }
}

HelpComponent = withAuth(HelpComponent);

export default HelpComponent;
