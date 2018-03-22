import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../common/Auth'
import GQUERY from '../../../graphql'

import { ToastContainer, toast } from 'react-toastify';
import copy from 'copy-to-clipboard';


const ReactMarkdown = require('react-markdown')


class MarketViewComponent extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
  }

  @autobind
  handleFocus(e){
    e.target.select();
  }

  @autobind
  handleCopy(){

    let crate = this.props.crate;

    copy('bundle:' + crate._id);

    toast.info("Copied Environment ID")

  }

  render() {

    let crate = this.props.crate;

    return (
      <div className="section">
        <div className="container">

          <div className="columns">
            <div className="column min-width">

              <h2 className="title is-6">
                <a onClick={e=>window.history.back()}>
                  Marketplace &gt; Environment
                </a>
              </h2>
              <h2 className="title is-4">
                {crate.name}
                <Link className="button pull-right" to={'/market/package/edit/' + crate._id + '/' + crate.name}>
                  Edit
                </Link>
              </h2>
              <h2 className="subtitle is-6">
                {crate.description}
              </h2>

              <hr />


              <h2 className="title is-6">
                Universe Capabilities:
              </h2>
              <pre style={{padding:'4px'}}><div className="content"><ReactMarkdown source={crate.universeCapabilities} /></div></pre>

              {/*
              <h2 className="title is-5">
               Usage / Social Proof 
              </h2>
              <p>
                ...
              </p>


              <br />
              <br />


              <h2 className="title is-5">
                Technical Details 
              </h2>
              
              <h2 className="title is-6">
                Environment Requirements
              </h2>
              <p>
                ...
              </p>


              <br />
              <br />


              <h2 className="title is-6">
                Nodes Included:
              </h2>
              <pre><code>{JSON.stringify(crate.nodes, null, 2)}</code></pre>

              <br />
              <br />

              */}
              {/*
              <h2 className="title is-6">
                Details/Features
              </h2>
              <div className="content">

                <p>
                  This is the default setup for a generic cloud instance. It includes a few basic elements: 
                </p>

                <ul>
                  <li>
                    Identity stored on-chain 
                  </li>
                  <li>
                    Basic smart assistant?
                  </li>
                </ul>

              </div>
              */}



            </div>
            <div className="column is-4 is-offset-1">

              <div className="field has-addons">
                <div className="control">
                  <input className="input" type="text"
                    value={'environment:' + crate._id} 
                    readOnly
                    onFocus={this.handleFocus}
                  />
                </div>
                <div className="control">
                  <button className="button" onClick={this.handleCopy}>
                    <span className="icon">
                      <i className="fa fa-clipboard"></i>
                    </span>
                  </button>
                </div>
                <div className="control">

                  <div className="dropdown is-hoverable is-right">
                    <div className="dropdown-trigger">
                      <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span>Deploy Environment</span>
                        <span className="icon is-small">
                          <i className="fa fa-angle-down" aria-hidden="true"></i>
                        </span>
                      </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                      <div className="dropdown-content">
                        <a href="#" className="dropdown-item">
                          <span style={{fontFamily:'courier'}}>
                            my cloud host somewhere
                          </span>
                        </a>
                        <hr className="dropdown-divider" />
                        <a href="#" className="dropdown-item">
                          Signup for Cloud Environment
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ToastContainer
                hideProgressBar={true}
                autoClose={2500}
              />


              <br />
              <br />


            </div>
          </div>

        </div>

      </div>
    )
  }
}


MarketViewComponent = withAuth(MarketViewComponent);

export default MarketViewComponent;
