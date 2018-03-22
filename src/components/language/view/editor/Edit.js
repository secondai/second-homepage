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

var jsSchema = require('js-schema');

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

  componentDidMount(){
    this.handleKeyDown();
  }

  @autobind
  saveUpdates(){

    return new Promise(async (resolve, reject)=>{

      this.setState({
        saving: true
      })

      let outputVal = this.getOutputVal();
      if(!outputVal){
        alert('Output val not valid');
        reject();
        return;
      }

      // create it on the server 
      let vars = {
        record: {
          _id: this.props.language._id,
          title: this.props.editState.fields.slug.value,
          slug: this.props.editState.fields.slug.value,
          schemaCode: this.props.editState.fields.schemaCode.value,
          schemaObj: JSON.parse(outputVal)
        }
      }
      this.props.mutate_updateLanguage({
        variables: vars
      })
      .then(({ data }) => {
        console.log('got update data', data);
        this.props.refetch();
        this.setState({
          saving: false
        },resolve)
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });

    });

    // redirect to it

  }

  @autobind
  getOutputVal(){

    let outputVal = null;

    try {
      let tmpFunc = `
      ${this.props.editState.fields.schemaCode.value}

      return Schema;
      `
      outputVal = JSON.stringify( Function(tmpFunc)() , null, 2);
      // this.check(value)
      // this.set({ value : value })
    } catch(e) {
      // this.set({ error : e.toString() })
      outputVal = null;
    }

    return outputVal;

  }

  @autobind
  handleUpdateType(){
    let newSlug = window.prompt('New Type:', this.props.editState.fields.slug.value);
    if(!newSlug){
      return false;
    }

    this.props.setEditState('slug',newSlug, ()=>{
      console.log('Saving updates');
      this.saveUpdates()
      .then(()=>{
        window.location = '/language/' + newSlug;
      })
    })

  }

  @autobind
  handleKeyDown(e){
    // // console.log(e.key, e.cmd, e.meta);
    // console.log(this.aceRef);
    // // this.aceRef.addEventListener('keyDown', e=>{
    // //   console.log('k:',e);
    // })
    if(this.aceRef.editor){
      this.aceRef.editor.commands.addCommand({
        name: 'save',
        bindKey: {
          win: 'Ctrl-S',
          mac: 'Command-S',
          // sender: 'editor|cli'
        },
        exec: (env, args, request)=>{
          this.saveUpdates();
        }
      });
    }

  }


  render() {

    // let subject = this.props.subject;

    let outputVal = this.getOutputVal() || 'Unable to parse';

    return (
      <div className="columns">

        
        <div className="column is-half">

          <div style={{height:'100px'}}>
            <div>
              <br />
              <button className={"button" + (this.state.saving ? ' is-loading':'')} onClick={this.saveUpdates}>
                Save Schema Updates
              </button>
            </div>
          </div>
          <div>
            <AceEditor
              ref={r=>this.aceRef=r}
              mode="jsx"
              theme="monokai"
              value={this.props.editState.fields.schemaCode.value}
              onChange={v=>this.props.setEditState('schemaCode',v)}
              name="UNIQUE_ID_OF_DIV2"
              editorProps={{$blockScrolling: true}}
              width="100%"
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2
              }}
            />
          </div>

          <div>
            <span onClick={this.handleUpdateType}>
              update type
            </span>
          </div>


          <div>
            <pre><code>
{`Schema = schema({
  input: {},
  output: {},
  '*':null
})`}
            </code></pre>
          </div>

        </div>

        <div className="column is-half">

          <div style={{height:'100px'}}>
            &nbsp;
          </div>
          <div>
            <AceEditor
              mode="jsx"
              theme="monokai"
              value={outputVal}
              name="UNIQUE_ID_OF_DIV3"
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

        </div>
        

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
  fields: ['slug','schemaCode', 'schemaObj'],
  fieldConvertServerFunc: {
    schemaObj: v=>{
      // jsSchema
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
