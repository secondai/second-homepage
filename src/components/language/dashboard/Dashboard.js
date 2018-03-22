import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import URL from 'url'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import Emojify from 'react-emojione'

import Utils from '../../common/Utils'
import {withAuth} from '../../common/Auth'
import GQUERY from '../../../graphql'

import List from './List'

class LanguageDashboardComponent extends Component {
  constructor(props){
    super(props);
  }

  @autobind
  async handleAddLanguage(){

    // ask for the URI
    let slug = window.prompt('slug', '');
    if(!slug){
      return false;
    }

    // create it on the server 
    let vars = {
      record: {
        title: slug,
        slug,
        schemaCode: `Schema = schema({
  '*':null
})`,
        schemaObj: {},
        active: true,
        createdAt: (new Date()).getTime()
      }
    }
    this.props.mutate_newLanguage({
      variables: vars
    })
    .then(({ data }) => {
      console.log('got new data', data);
      this.props.data.refetch();
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });

    // redirect to it

  }

  render() {

    // let languages = [];
    // if(this.props.dataPrivate.viewer){
    //   languages = this.props.dataPrivate.viewer.language.many;
    // }

    // console.log('languages', languages);

    return (
      <div className="section">
        <div className="container">

          <div className="columns">

            <div className="column is-4">

              <button className="button is-small" onClick={this.handleAddLanguage} style={{position:'absolute',top:'-28px'}}>
                Add Rule
              </button>

              <h3 className="title is-4">
                Language Rules/Schemas
              </h3>

              <List 
                loading={this.props.data.loading} 
                languages={this.props.data.loading ? []:(this.props.data.viewer.language.many || [])} 
              />

            </div>


          </div>

        </div>
      </div>
    )
  }
}

LanguageDashboardComponent = compose(
  // Private
  graphql(GQUERY.language.query.languages, {
    name: 'data',
    options: {
      variables: {
        filter: {
        }
      }
    }
  }),

  // Public, I've starred (stars are just another sort of metadata?) 
  graphql(GQUERY.language.mutation.newLanguage, {
    name: 'mutate_newLanguage'
  }),

)(LanguageDashboardComponent);

LanguageDashboardComponent = withAuth(LanguageDashboardComponent);
LanguageDashboardComponent = withApollo(LanguageDashboardComponent);


export default LanguageDashboardComponent;
