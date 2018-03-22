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


class NodeDashboardComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      tabKey: 'starter'
    }
    this.createOrbitListener();
  }

  componentDidMount(){
    this.props.data.refetch();
  }

  @autobind
  async createOrbitListener(){
    if(this.orbitListener){
      return;
    }

    if(!window.orbitdb){
      setTimeout(this.createOrbitListener,1000);
      return;
    }

    this.orbitListener = true;

    console.log('Creating orbit connection', process.env.REACT_APP_ORBITDB_ADDRESS);

    try {

      const db = await window.orbitdb.log(process.env.REACT_APP_ORBITDB_ADDRESS)

      console.log('Loading orbitdb data');

      await db.load();

      window.odb = db;

      // When the second database replicated new heads, query the database
      db.events.on('replicated', () => {
        const result = db.iterator({ limit: -1 }).collect().map(e => e.payload.value)
        console.log('NEW ORBITDB VALUE:', result.join('\n'))
      })
    }catch(err){
      console.error(err);
    }



  }

  render() {

    return (
      <div className="section">
        <div className="container">

          <div className="columns">
            <div className="column is-12 min-width">

              <List 
                loading={this.props.data.loading} 
                nodes={this.props.data.loading ? []:(this.props.data.viewer.node.many || [])} 
              />

            </div>

            {/*<div className="column is-4">

              <h3 className="title is-4">
                OrbitDB Log Entries
              </h3>

            </div>*/}
          </div>

        </div>

      </div>

    )
  }
}

NodeDashboardComponent = compose(

  graphql(GQUERY.node.query.nodes, {
    name: 'data',
    options: {
      variables: {
        filter: {
        },
        limit: 25
      }
    }
  }),
  // Public, I've starred (stars are just another sort of metadata?) 
  graphql(GQUERY.node.mutation.newNode, {
    name: 'mutate_newNode'
  }),

)(NodeDashboardComponent);

NodeDashboardComponent = withAuth(NodeDashboardComponent);
NodeDashboardComponent = withApollo(NodeDashboardComponent);


export default NodeDashboardComponent;
