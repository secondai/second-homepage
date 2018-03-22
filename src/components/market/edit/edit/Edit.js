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
    this.state = {};

  }

  componentWillReceiveProps(){
    // // Receiving updated props 
    // // - State is managed by the EditManager
    // window.setTimeout(this.updateEditState,0)
  }

  @autobind
  saveUpdates(){

    return new Promise(async (resolve, reject)=>{

      let nodes = this.props.editState.fields.nodes.value;

      try {
        nodes = JSON.parse(nodes);
      }catch(err){
        alert('Nodes must be valid JSON');
        return false;
      }

      this.setState({
        saving: true
      })

      // create it on the server 
      let vars = {
        record: {
          _id: this.props.crate._id,
          name: this.props.editState.fields.name.value,
          type: this.props.editState.fields.type.value,
          environment: this.props.editState.fields.environment.value,
          universeCapabilities: this.props.editState.fields.universeCapabilities.value,
          envRequirements: this.props.editState.fields.envRequirements.value,
          platform: this.props.editState.fields.platform.value,
          description: this.props.editState.fields.description.value,
          nodes: nodes
        }
      }
      this.props.mutate_updateCrate({
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
        this.setState({
          saving: false
        },resolve)
      });

    });

    // redirect to it

  }

  render() {

    // let node = this.props.node;

    let { value, parentValue } = this.props.editState.fields.nodes;
    console.log('NODES VALUE:', value, typeof value, parentValue);

    return (

      <div className="section">
        <div className="container">

          <div className="columns">
            <div className="column is-6">

              <div className="field">
                <div className="control">
                  <label className="label">Name</label>
                  <input 
                    className="input" 
                    type="text" 
                    placeholder="Name"
                    value={this.props.editState.fields.name.value} 
                    onChange={e=>this.props.setEditState('name',e.target.value)} 
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Type</label>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <label className="radio">
                        <input type="radio" name="type" 
                          value={'bundle'}
                          checked={(this.props.editState.fields.type.value == 'bundle') ? true:false}
                          onChange={e=>this.props.setEditState('type',e.target.value)} 
                        />
                        &nbsp;Bundle&nbsp;
                      </label>
                      <label className="radio">
                        <input type="radio" name="type" 
                          value={'environment'}
                          checked={(this.props.editState.fields.type.value == 'environment') ? true:false}
                          onChange={e=>this.props.setEditState('type',e.target.value)} 
                        />
                        &nbsp;Environment
                      </label>
                    </div>
                  </div>
                </div>
              </div>


              {
                this.props.crate.type == 'bundle' ?
                  <div className="field">
                    <div className="control">
                      <label className="label">Environment (link to environment on a platform)</label>
                      <input 
                        className="input" 
                        type="text" 
                        placeholder="stdenv/..."
                        value={this.props.editState.fields.environment.value} 
                        onChange={e=>this.props.setEditState('environment',e.target.value)} 
                      />
                    </div>
                  </div>
                :
                  <div className="field">
                    <div className="control">
                      <label className="label">Platform (cloud, browser, mobile, device)</label>
                      <input 
                        className="input" 
                        type="text" 
                        placeholder="cloud, browser, mobile, device"
                        value={this.props.editState.fields.platform.value} 
                        onChange={e=>this.props.setEditState('platform',e.target.value)} 
                      />
                    </div>
                  </div>
              }

              <div className="field">
                <div className="control">
                  <label className="label">Description</label>
                  <input 
                    className="input" 
                    type="text" 
                    placeholder="description"
                    value={this.props.editState.fields.description.value} 
                    onChange={e=>this.props.setEditState('description',e.target.value)} 
                  />
                </div>
              </div>

              {
                this.props.crate.type == 'bundle' ? 
                  <div className="field">
                    <div className="control">
                      <label className="label">Environment Requirements</label>
                      <textarea 
                        className="textarea" 
                        type="text" 
                        placeholder=""
                        value={this.props.editState.fields.envRequirements.value} 
                        onChange={e=>this.props.setEditState('envRequirements',e.target.value)} 
                      />
                    </div>
                  </div>
                :
                  <div className="field">
                    <div className="control">
                      <label className="label">Universe Capabilities</label>
                      <textarea 
                        className="textarea" 
                        type="text" 
                        placeholder=""
                        value={this.props.editState.fields.universeCapabilities.value} 
                        onChange={e=>this.props.setEditState('universeCapabilities',e.target.value)} 
                      />
                    </div>
                  </div>
              }

              <div className="field">
                <div className="control">
                  <label className="label">Nodes</label>
                  <textarea 
                    className="textarea" 
                    type="text" 
                    placeholder="Nodes"
                    value={this.props.editState.fields.nodes.value} 
                    onChange={e=>this.props.setEditState('nodes',e.target.value)} 
                  />
                </div>
              </div>

            </div>

            <div className="column">

              <button className={'button is-primary ' + (this.state.saving ? 'is-loading':'')} onClick={this.saveUpdates}>
                Save Changes
              </button>

              <br />
              <br />

              <button className="button is-white" onClick={e=>window.history.back()}>
                &lt; Back
              </button>

            </div>

          </div>
        </div>

        {/*
          !this.props.editState.fields.nodes.pendingParent ? '':
          <div>
            Pending update for nodes!: {this.props.editState.fields.nodes.pendingParentValue}
          </div>
        */}
      </div>
    )
  }
}

EditComponent = compose(
  graphql(GQUERY.crate.mutation.updateCrate, {
    name: 'mutate_updateCrate'
  }),
)(EditComponent);


EditComponent = withEditManager(EditComponent,{
  editProp: 'crate',
  fields: ['name','description','type','environment','platform','envRequirements', 'universeCapabilities', 'nodes'],
  fieldConvertServerOnceFunc: {
    nodes: v=>{
      // jsSchema
      return JSON.stringify(v,null,2);
    }
  },
});
EditComponent = withAuth(EditComponent);

export default EditComponent;
