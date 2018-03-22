import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../../common/Auth'
import GQUERY from '../../../../graphql'

import ListItem from './ListItem'

class ListComponent extends Component {
  constructor(props){
    super(props);
  }

  @autobind
  async handleNewKeyBundle(){

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
        keys: [],
        active: true,
        createdAt: (new Date()).getTime()
      }
    }
    this.props.mutate_newKey({
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

    const { loading, keys } = this.props;

    console.log('keys', keys);

    return (

      <div>

        <h2 className="title is-4">
          Keys

          {/*<Link className="button is-small pull-right" to="/keys/add">
            New Key
          </Link>*/}

        </h2>
        <h2 className="subtitle is-5">
          Public Keys that can post to chain 
        </h2>

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
              <th>
                Name
              </th>
              <th>
                Public Contact Info
              </th>
              <th>
                Key
              </th>
              <th>
                canCreate
              </th>
              <th>
                Created
              </th>
            </tr>
          </thead>
          <tbody>

            {
              keys.map(key=>(
                <ListItem
                  key={key._id}
                  keyVal={key}
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
