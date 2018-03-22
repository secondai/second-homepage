import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import ReactTable from 'react-table'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../../common/Auth'
import {withEditManager} from '../../../common/EditManager'
import GQUERY from '../../../../graphql'



class EditComponent extends Component {
  constructor(props){
    super(props);

    // this.setupInitialState();

  }

  componentWillReceiveProps(){
    // // Receiving updated props 
    // // - State is managed by the EditManager
    // window.setTimeout(this.updateEditState,0)
  }

  render() {

    let subject = this.props.subject;

    return (
      <div>

        <input value={this.props.editState.fields.title.value} onChange={e=>this.props.setEditState('title',e.target.value)} />
        {
          !this.props.editState.fields.title.pendingParent ? '':
          <div>
            Pending update for title!: {this.props.editState.fields.title.pendingParentValue}
          </div>
        }
      </div>
    )
  }
}

EditComponent = withEditManager(EditComponent,{
  editProp: 'subject',
  fields: ['title'],
  fieldCompareFunc: {
    uri: (prev, next)=>{
      console.log('URI compare!:', prev, next);
      return prev === next;
    }
  }
});
EditComponent = withAuth(EditComponent);

export default EditComponent;
