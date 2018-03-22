import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../../common/Auth'
import GQUERY from '../../../../graphql'

import moment from 'moment'

class ListItemComponent extends Component {
  constructor(props){
    super(props);
  }

  render() {

    let key = this.props.keyVal;

    return (
      <tr>
        <td>
          {key.name}
        </td>
        <td>
          {key.publicContact}
        </td>
        <td>
          <pre><code>{key.pubKey}</code></pre>
        </td>
        <td>
          {
            key.canCreate ? 'Yes':'-'
          }
        </td>
        <td>
          {key.createdAt}
        </td>
      </tr>
    )
  }
}

ListItemComponent = withAuth(ListItemComponent);

export default ListItemComponent;
