import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import ReactTable from 'react-table'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../../common/Auth'
import GQUERY from '../../../../graphql'

class RelatedComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      editing: false
    }
  }

  componentWillReceiveProps(){
  }

  render() {

    let subject = this.props.subject;

    return (
      <div>

        <h3 className="title is-6">
          Similar, Private: 
        </h3>


        <h3 className="title is-6">
          Similar, Public: 
        </h3>
        
      </div>
    )
  }
}

RelatedComponent = withAuth(RelatedComponent);

export default RelatedComponent;
