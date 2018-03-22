import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import ReactTable from 'react-table'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../common/Auth'
import GQUERY from '../../../graphql'

import Detail from './language/Detail'
import Schema from './schema/Schema'
import Editor from './editor/Editor'
// import Related from './language/Related'
// import PointerList from './pointers/List'

class LanguageViewComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      datetime: 0
    }
  }

  componentDidMount(){
    // window.setInterval(()=>{
      // console.log('Refetcing');
      // this.props.data.refetch();
      // this.setState({
      //   datetime: (new Date()).getTime()
      // })
    // },3000)
  }

  render() {

    let language = this.props.data.viewer ? this.props.data.viewer.language.one:null;

    if(!language && this.props.data.loading){
      return (
        <div>
          Loading
        </div>
      )
    }

    return (
      <div className="section">
        <div className="container">

          <div className="columns">

            <div className="column is-8">

              <Detail 
                language={language} 
                refetch={this.props.data.refetch} 
              />
              {
                /* schema should be here */
              }

              <Editor 
                language={language} 
                refetch={this.props.data.refetch} 
                />

              {/*
              <PointerList 
                language={language} 
                refetch={this.props.data.refetch} 
                />
              */}

            </div>

            <div className="column is-4">

              <div style={{height:'100px'}}>
              &nbsp;
              </div>

              <Schema 
                language={language} 
                refetch={this.props.data.refetch} 
                />

            </div>


          </div>

        </div>
      </div>
    )
  }
}

LanguageViewComponent = withAuth(LanguageViewComponent);

LanguageViewComponent = compose(
  graphql(GQUERY.language.query.languageBySlug, {
    name: 'data',
    skip: props => !props.match.params.languageSlug,
    options: props => ({
      variables: {
        slug: props.match.params.languageSlug
      }
    })
  }),

)(LanguageViewComponent);


export default LanguageViewComponent;
