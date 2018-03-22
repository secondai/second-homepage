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

import Edit from './Edit'

class DetailComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      editing: false
    }
  }

  componentWillReceiveProps(){
  }

  render() {

    let language = this.props.language;

    if(this.state.editing){
      return (
        <Edit {...this.props} />
      )
    }

    return (
      <div>

        <h3 className="title is-5">
          &nbsp;
        </h3>
        <h5 className="subtitle is-6" style={{marginBottom:'0px'}}>
          &nbsp;
        </h5>
        <div>
          <strong>Final Schema: </strong>
        </div>
        
        <AceEditor
          mode="jsx"
          theme="monokai"
          value={JSON.stringify(language.schemaObj, null, 2)}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{$blockScrolling: true}}
          width="100%"
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
            readOnly: true
          }}
        />
      
      </div>
    )
  }
}

DetailComponent = withAuth(DetailComponent);

export default DetailComponent;
