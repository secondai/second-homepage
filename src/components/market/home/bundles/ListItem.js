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

    let crate = this.props.crate;

    return (
      <tr>
        <td>
          <Link to={"/market/package/" + crate._id + "/" + crate.name}>
            {crate.name}
          </Link>
        </td>
        <td>
          {crate.environment}
        </td>
      </tr>
    )
  }
}

ListItemComponent = withAuth(ListItemComponent);

export default ListItemComponent;
