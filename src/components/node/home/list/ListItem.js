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

    let node = this.props.node;

    return (
      <tr>
        <td>
          <Link to={"/node/" + node._id + "/" + node.type}>
            {node._id}
          </Link>
        </td>
        <td className="truncate">
          {node.type}
        </td>
        <td className="truncate">
          {node.ref}
        </td>
        <td className="truncate">
          {node.version}
        </td>
        <td>
          <pre><code>{node.author}</code></pre> {/*lookup name in db by public key! */}
        </td>
        <td>
          {node.createdAt}
        </td>
      </tr>
    )
  }
}

ListItemComponent = withAuth(ListItemComponent);

export default ListItemComponent;
