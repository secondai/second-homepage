import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import ReactTable from 'react-table'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../common/Auth'
import {withEditManager} from '../../common/EditManager'
import GQUERY from '../../../graphql'

var NodeRSA = require('node-rsa');

window.NodeRSA = NodeRSA;


class AddComponent extends Component {
  constructor(props){
    super(props);

    // this.setupInitialState();
    this.state = {
      name: '',
      pubKey: '',
      publicContact: '',
      privateContact: ''
    };

  }

  componentWillReceiveProps(){
    // // Receiving updated props 
    // // - State is managed by the EditManager
    // window.setTimeout(this.updateEditState,0)
  }

  @autobind
  saveUpdates(){

    return new Promise(async (resolve, reject)=>{

      // Send information to server for validation 

      this.setState({
        saving: true
      })

      // create it on the server 
      let vars = {
        record: {
          name: this.state.name,
          pubKey: this.state.pubKey,
          publicContact: this.state.publicContact,
          privateContact: this.state.privateContact,
          createdAt: (new Date()).getTime()
        }
      }
      this.props.mutate_addKey({
        variables: vars
      })
      .then(({ data }) => {
        console.log('Response', data.key.create);
        // this.props.refetch();

        this.setState({
          saving: false
        },resolve)

        try {
          if(data.key.add.recordId){
            // alert('Saved! New Node ID: ' + data.key.create.key._id);
            window.location = '/keys';
          }
        }catch(err){
          // alert('Failed saving');
          console.error('FAILED SAVING!!!');
        }

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

    let state = this.state;

    return (

      <div className="section">
        <div className="container">

          <div className="columns">
            <div className="column is-6">

              <h2 className="title is-4">
                Request Write Access
              </h2>
              <h2 className="subtitle is-5">
                Please enter some basic verification info! 
              </h2>

              <div className="field">
                <div className="control">
                  <label className="label">Name</label>
                  <input 
                    className="input" 
                    type="text" 
                    placeholder=""
                    value={this.state.name} 
                    onChange={e=>this.setState({name:e.target.value})} 
                  />
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <label className="label">Public Contact Info</label>
                  <input 
                    className="input" 
                    type="text" 
                    placeholder=""
                    value={this.state.publicContact} 
                    onChange={e=>this.setState({publicContact:e.target.value})} 
                  />
                  <p className="help">
                    What is your public contact info? Everyone will be able to see this. 
                  </p>
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <label className="label">Private Contact Info</label>
                  <input 
                    className="input" 
                    type="text" 
                    placeholder=""
                    value={this.state.privateContact} 
                    onChange={e=>this.setState({privateContact:e.target.value})} 
                  />
                  <p className="help">
                    This is private and will be used to contact you for verification/issuance. 
                  </p>
                </div>
              </div>


              <div className="field">
                <div className="control">
                  <label className="label">Public Key</label>
                  <textarea 
                    className="textarea" 
                    type="text" 
                    placeholder=""
                    value={this.state.pubKey} 
                    onChange={e=>this.setState({pubKey:e.target.value})} 
                  />
                </div>
              </div>



              <div className="field is-grouped">
                <div className="control">
                  <button className={'button is-primary ' + (this.state.saving ? 'is-loading':'')} onClick={this.saveUpdates}>
                    Request Write Access
                  </button>
                </div>
                <div className="control">
                  <button className="button" onClick={e=>window.history.back()}>
                    &lt; Cancel
                  </button>
                </div>
              </div>


            </div>

            <div className="column">

              &nbsp;

            </div>

          </div>
        </div>

        {/*
          !this.state.nodes.pendingParent ? '':
          <div>
            Pending update for nodes!: {this.state.nodes.pendingParentValue}
          </div>
        */}
      </div>
    )
  }
}

AddComponent = compose(
  graphql(GQUERY.key.mutation.addKey, {
    name: 'mutate_addKey'
  }),
)(AddComponent);

AddComponent = withAuth(AddComponent);

export default AddComponent;
