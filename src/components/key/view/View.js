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

import ViewBundle from './ViewBundle'
import ViewEnvironment from './ViewEnvironment'



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

    let crate = this.props.data.viewer ? this.props.data.viewer.crate.byId:null;

    copy('bundle:' + crate._id);

    toast.info("Copied bundle ID")

  }

  render() {

    let crate = this.props.data.viewer ? this.props.data.viewer.crate.byId:null;

    if(!crate || this.props.data.loading){
      return (
        <div className="section">
          <div className="hero is-medium">
            <div className="hero-body has-text-centered">
              Loading
            </div>
          </div>
        </div>
      )
    }

    switch(crate.type){
      case 'bundle':
        return (
          <ViewBundle crate={crate} />
        )
      case 'environment':
        return (
          <ViewEnvironment crate={crate} />
        )
    }

  }
}

MarketViewComponent = compose(
  graphql(GQUERY.crate.query.crate, {
    name: 'data',
    options: props => ({
      variables: {
        _id: props.match.params.id
      }
    })
  }),

)(MarketViewComponent);


MarketViewComponent = withAuth(MarketViewComponent);

export default MarketViewComponent;
