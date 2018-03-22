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

import Edit from './Edit'

class DetailComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      editing: false
    }
  }

  componentWillReceiveProps(){
  }

  render() {

    let language = this.props.language;

    // if(this.state.editing){
      return (
        <Edit {...this.props} />
      )
    // }

    return (
      <div>

        <h3 className="title is-5">
          {language.title || '*no title*'}
        </h3>
        <h5 className="subtitle is-6" style={{marginBottom:'0px'}}>
          <a href={language.slug} target="_blank">{language.slug}</a>
        </h5>
        <div>
          Created by: <Link to={`/u/${language.createdByUser._id}`}>{language.createdByUser.username}</Link>
        </div>
        
      </div>
    )
  }
}

DetailComponent = withAuth(DetailComponent);

export default DetailComponent;
