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

import List from './list/List'

class KeyDashboardComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      tabKey: 'starter'
    }
  }

  componentDidMount(){
    this.props.data.refetch();
  }

  render() {

    return (
      <div className="section">
        <div className="container">

          <div className="columns">
            <div className="column is-8 min-width">

              <List 
                loading={this.props.data.loading} 
                keys={this.props.data.loading ? []:(this.props.data.viewer.key.many || [])} 
              />

            </div>
            <div className="column is-4">

              <div className="box">

                <Link to="/keys/add" className="button is-primary">
                  Request Write-Access
                </Link>

                <br />
                <br />

                Adding to the Node Chain is currently limited to approved users (Public Keys listed). 

                

              </div>

            </div>
          </div>

        </div>

      </div>

    )
  }
}

KeyDashboardComponent = compose(

  graphql(GQUERY.key.query.keys, {
    name: 'data',
    options: {
      variables: {
        filter: {
        }
      }
    }
  }),
  // Public, I've starred (stars are just another sort of metadata?) 
  graphql(GQUERY.key.mutation.newKey, {
    name: 'mutate_newKey'
  }),

)(KeyDashboardComponent);

KeyDashboardComponent = withAuth(KeyDashboardComponent);
KeyDashboardComponent = withApollo(KeyDashboardComponent);


export default KeyDashboardComponent;
