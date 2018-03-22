import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../../common/Auth'
import GQUERY from '../../../../graphql'


class ListItemComponent extends Component {
  constructor(props){
    super(props);
  }

  render() {

    let pointer = this.props.pointer;

    switch(pointer.type){
      case 'text':
        break;

      case 'emoji':
        break;

      case 'tag':
        break;

      case 'json': // object
        // JSON data that is searchable! 
        break;

      case 'blob': // blob/file
        // JSON data that is searchable! 
        break;

      default:
        return (
          <div>
            Unable to display metadata of type: "{pointer.type}"
          </div>
        )
    }

    // Return display part
    return (
      <div>
        Unable to display metadata of type: "{pointer.type}"
      </div>
    )

  }
}

ListItemComponent = withAuth(ListItemComponent);

export default ListItemComponent;
