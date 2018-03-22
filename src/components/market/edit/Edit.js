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

import Edit from './edit/Edit'

class MarketViewComponent extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
  }

  render() {

    let crate = this.props.data.viewer ? this.props.data.viewer.crate.byId:null;

    if(!crate && this.props.data.loading){
      return (
        <div>
          Loading
        </div>
      )
    }

    return (
      <Edit 
        crate={crate}
        refetch={this.props.data.refetch}
      />
    )
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
