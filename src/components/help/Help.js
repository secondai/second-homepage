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
                  Contact
                </h3>


                <br />

                <h3>
                  About Second
                </h3>
                <p>
                  Initial Release March 2018. Copyright Nicholas Reed. 
                </p>

                <br />

              </div>



            </div>

            <div className="column is-6">


            </div>
          </div>

        </div>

      </div>
    )
  }
}

HelpComponent = withAuth(HelpComponent);

export default HelpComponent;
