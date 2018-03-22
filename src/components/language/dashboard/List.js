import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../common/Auth'
import GQUERY from '../../../graphql'

import ListItem from './ListItem'

class ListComponent extends Component {
  constructor(props){
    super(props);
  }

  render() {

    const { loading, languages } = this.props;

    console.log('languages', languages);

    return (
      <div className="list">
        {
          languages.map(language=>(
            <ListItem
              key={language._id}
              language={language}
            />
          ))
        }
      </div>
    )
  }
}

ListComponent = withAuth(ListComponent);

export default ListComponent;
