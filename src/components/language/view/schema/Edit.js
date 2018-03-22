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


import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/jsx';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';


class EditComponent extends Component {
  constructor(props){
    super(props);

    // this.setupInitialState();
    this.state = {
      saving: false
    }

  }

  componentWillReceiveProps(){
    // // Receiving updated props 
    // // - State is managed by the EditManager
    // window.setTimeout(this.updateEditState,0)
  }

  @autobind
  async saveUpdates(){

    this.setState({
      saving: true
    })

    // create it on the server 
    let vars = {
      record: {
        _id: this.props.language._id,
        schemaObj: JSON.parse(this.props.editState.fields.schemaObj.value)
      }
    }
    this.props.mutate_updateLanguage({
      variables: vars
    })
    .then(({ data }) => {
      console.log('got update data', data);
      this.setState({
        saving: false
      })
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });

    // redirect to it

  }

  render() {

    // let subject = this.props.subject;

    return (
      <div>

        <div>
          <button className={"button" + (this.state.saving ? ' is-loading':'')} onClick={this.saveUpdates}>
            Save Schema Updates
          </button>
        </div>
        <hr />
        <div>
          <AceEditor
            mode="jsx"
            theme="monokai"
            value={this.props.editState.fields.schemaObj.value}
            onChange={v=>this.props.setEditState('schemaObj',v)}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{$blockScrolling: true}}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </div>
        {
          !this.props.editState.fields.schemaObj.pendingParent ? '':
          <div>
            Pending update!: {this.props.editState.fields.schemaObj.pendingParentValue}
          </div>
        }

      </div>
    )
  }
}


EditComponent = compose(
  // Public, I've starred (stars are just another sort of metadata?) 
  graphql(GQUERY.language.mutation.updateLanguage, {
    name: 'mutate_updateLanguage'
  }),

)(EditComponent);


EditComponent = withEditManager(EditComponent,{
  editProp: 'language',
  fields: ['schemaObj'],
  fieldConvertServerFunc: {
    schemaObj: v=>{
      return JSON.stringify(v,null,2);
    }
  },
  fieldCompareFunc: {
    // schemaObj: (prev, next)=>{
    //   // console.log('URI compare!:', prev, next);
    //   return prev === next;
    // }
  }
});
EditComponent = withAuth(EditComponent);

export default EditComponent;
