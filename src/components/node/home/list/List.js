import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import _ from 'lodash'

import autobind from 'autobind-decorator'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../../common/Auth'
import GQUERY from '../../../../graphql'

import ListItem from './ListItem'

class ListComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      showHelp: false
    }
  }

  @autobind
  async handleNewNodeBundle(){

    let name = window.prompt('name', '');
    if(!name){
      return false;
    }


    let environment = window.prompt('environment', 'stdenv/cloud');
    if(!environment){
      return false;
    }

    // create it on the server 
    let vars = {
      record: {
        name,
        type: 'bundle',
        description: '...',
        environment,
        nodes: [],
        active: true,
        createdAt: (new Date()).getTime()
      }
    }
    this.props.mutate_newNode({
      variables: vars
    })
    .then(({ data }) => {
      console.log('got new data', data);
      this.props.dataBundles.refetch();
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });

    // redirect to it

  }

  render() {

    let { loading, nodes } = this.props;

    console.log('nodes', nodes);
    nodes = _.sortBy(nodes,n=>{
      return n.createdAt || 0;
    }).reverse();

    return (

      <div>

        <h2 className="title is-4">
          NodeChain

           {/* 
          <button className="button is-small pull-right" onClick={this.handleNewNodeBundle}>
            New Node
          </button>
          */}

          <Link className="button is-small pull-right" to="/nodes/add">
            New Node
          </Link>

        </h2>
        <h2 className="subtitle is-5">
          Chain of validated Nodes pinned on IPFS (<a onClick={e=>this.setState({showHelp: !this.state.showHelp})}>learn more</a>)
        </h2>

        {
          !this.state.showHelp ? '':
          <div className="message">
            <div className="message-body">
              Nodes in the database are published to an OrbitDB eventlog (append-only) and a Firebase stream 
              <br />
              - each entry is an IPFS hash of the database entry, which has the author, ipfsHashOfNode, nonce, signature, etc. 
              <br />
              - API at api.getasecond.com/graphql (browse using GraphiQL: <a href="https://api.getasecond.com/graphiql">https://api.getasecond.com/graphiql</a>)
              <br />
              - OrbitDB Address: (TODO) (https://github.com/orbitdb/orbit-db/blob/master/GUIDE.md#replicating-a-database)
              <br />
              - Firebase: (TODO) 
            </div>
          </div>
        }

        {/*<div className="field">
          <div className="control has-icons-left has-icons-right">
            <input 
              className="input" 
              type="text" 
              placeholder="Filter by name or description"
            />
            <span className="icon is-small is-left">
              <i className="fa fa-search"></i>
            </span>
          </div>
        </div>*/}

        <table className="table is-fullwidth" style={{tableLayout:'fixed'}}>
          <thead>
            <tr>
              <th style={{width:'40px'}}>
                Id
              </th>
              <th>
                Type
              </th>
              <th>
                Ref
              </th>
              <th style={{width:'80px'}}>
                Version
              </th>
              <th>
                Author
              </th>
              <th>
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>

            {
              nodes.map(node=>(
                <ListItem
                  key={node._id}
                  node={node}
                />
              ))
            }

          </tbody>
        </table>

      </div>

    )
  }
}

ListComponent = withAuth(ListComponent);

export default ListComponent;
