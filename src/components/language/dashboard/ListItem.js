import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../common/Auth'
import GQUERY from '../../../graphql'


class ListItemComponent extends Component {
  constructor(props){
    super(props);
  }

  render() {

    let language = this.props.language;

    return (
      <div className="box">
        <Link to={'/language/' + language.slug}>
          {language.title}
        </Link>
        <br />
        <small>
          {
            language.slug
          }
        </small>
      </div>
    )
  }
}

ListItemComponent = withAuth(ListItemComponent);

export default ListItemComponent;
