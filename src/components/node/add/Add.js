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


import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/jsx';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';


var Stringify = require('json-stable-stringify');

var SHA256 = require("crypto-js/sha256");
var NodeRSA = require('node-rsa');
var jsSchema = require('js-schema');
const cryptico = require('cryptico');

const uuidv4 = require('uuid/v4');

window.NodeRSA = NodeRSA;
window.SHA256 = SHA256;
window.cryptico = cryptico;
// // The passphrase used to repeatably generate this RSA key. 
// var PassPhrase = "The Moon is a Harsh Mistress."; 
 
// // The length of the RSA key, in bits. 
// var Bits = 1024; 
 
// var MattsRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);


const defaultPrivateKey = process.env.REACT_APP_PRIVATE_KEY ? atob(process.env.REACT_APP_PRIVATE_KEY):'';

let defaultNode = `{
  "type" : "",
  "nodeId" : null,
  "data" : {

  }
}`;

class AddComponent extends Component {
  constructor(props){
    super(props);

    let key;
    let defaultPublicKey;
    if(defaultPrivateKey){
      key = new NodeRSA(defaultPrivateKey);
      defaultPublicKey = key.exportKey('public'); //defaultPublicKey,
    }

    // this.setupInitialState();
    this.state = {
      nodeInputStr: defaultNode || '',
      ipfsHash: '', // Qmdn37YnyNiDarduQTjG8KRZ2sr95zrTe8Ug1NLMzwB5GW
      pubKey: defaultPublicKey || '',
      chainPubKey: '',
      ref: uuidv4(),
      version: 1,
      nonce: uuidv4(),
      sig: '',
      privateKey: defaultPrivateKey || '', // only used to create signature
      fetchingIpfs: false,
      triedSave: false,
      saveOk: false,
      ipfsStringResult: null, // downloaded from ipfs
      ipfsStringPretty: null,
      ipfsObjResult: null // downloaded from ipfs, parsed 
    };

    this.fetchChainPublicKey();

  }

  componentWillReceiveProps(){
    // // Receiving updated props 
    // // - State is managed by the EditManager
    // window.setTimeout(this.updateEditState,0)
  }

  @autobind
  async fetchChainPublicKey(){

    let keyResponse = await fetch('/chainkey',{
      json: true
    }).then(response=>{
      console.log('Respones:', response);
      window.re = response;
      return response.json();
    })

    if(keyResponse.key){
      this.setState({
        chainPubKey: keyResponse.key
      });
    }

  }

  @autobind
  saveUpdates(){

    return new Promise(async (resolve, reject)=>{

      // Send information to server for validation 

      // update ipfsHash and signature 
      await this.fetchIPFSHash();

      // can only submit when valid JSON/schema
      let nodeInputStr = this.state.nodeInputStr;

      let vals = await window.ipfs.files.add(new Buffer(Stringify(JSON.parse(nodeInputStr)),'utf8'));

      let ipfsHash = vals[0].hash;

      this.setState({
        triedSave: true,
        saveOk: false
      });

      if(ipfsHash != this.state.ipfsHash){
        this.setState({
          saving: false,
          saveResult: 'Hash generated does not match Node content',
          saveResultData: null
        })
        return false;
      }

      this.setState({
        saving: true,
        saveResult: null,
        saveResultData: null
        // lastNodeId: null
      })

      // create it on the server 
      let vars = {
        record: {
          // ipfsHash: this.state.ipfsHash,
          nodeInputStr: this.state.nodeInputStr,
          pubKey: this.state.pubKey,
          ref: this.state.ref,
          version: this.state.version,
          nonce: this.state.nonce,
          signature: this.state.sig,
        }
      }
      this.props.mutate_addNode({
        variables: vars
      })
      .then(({ data }) => {
        let responseInfo = data.node.add;
        console.log('Response', responseInfo);
        // this.props.refetch();

        this.setState({
          saving: false
        },resolve)


        if(responseInfo.error){
          return this.setState({
            saveResult: responseInfo.message || 'Failed Adding'
          })
        }

        try {
          if(responseInfo.node._id){
            // alert('Saved! New Node ID: ' + responseInfo.node._id);
            this.setState({
              saveResult: '', // 'Saved'
              saveOk: true,
              saveResultData: responseInfo,
              // lastNodeId: responseInfo.node._id

              // new values for nonce and version
              nonce: uuidv4(),
              version: parseInt(this.state.version,10) + 1

            })
          }
        }catch(err){
          // alert('Failed saving');
          console.error("FAILED SAVING");

          this.setState({
            saveResult: 'Failed Adding'
          })

        }

      }).catch((error) => {
        console.log('there was an error sending the query', error);
        this.setState({
          saving: false,
          saveResult: 'Failed Adding'
        },resolve)
      });

    });

    // redirect to it

  }

  @autobind
  async fetchIPFSHash(){

    return new Promise(async(resolve,reject)=>{

      // can only submit when valid JSON/schema
      let nodeInputStr = this.state.nodeInputStr;

      let vals = await window.ipfs.files.add(new Buffer(Stringify(JSON.parse(nodeInputStr)),'utf8'));

      let ipfsHash = vals[0].hash;

      let newStateObj = {};

      newStateObj.ipfsHash = ipfsHash;
      // this.setState({
      //   ipfsHash
      // })

      // Signature
      if(this.state.privateKey.length){
        var key = new NodeRSA(this.state.privateKey);

        let pubKey = this.state.pubKey;
        // also update public key if empty 
        if(!pubKey.length){
          pubKey = key.exportKey('public');
          newStateObj.pubKey = pubKey;
        }

        // ipfsHash + sha256(pubKey) + version + nonce
        let strToSign = [
          ipfsHash, 
          // SHA256(this.state.pubKey).toString(),
          pubKey,
          // btoa(this.state.pubKey),
          this.state.chainPubKey, 
          this.state.ref,
          this.state.version,
          this.state.nonce
        ];
        // console.log('strToSign', strToSign);
        strToSign = strToSign.join('');
        let signature = key.sign(strToSign,'hex');

        newStateObj.sig = signature;

        // this.setState({
        //   sig: signature
        // })

      }

      this.setState(newStateObj,resolve)

    });

  }

  @autobind
  async fetchIPFSNode(){

    let ipfsHash = this.state.ipfsHash;
    console.log('ipfsHash:', ipfsHash);


    // Signature
    if(this.state.privateKey.length){
      var key = new NodeRSA(this.state.privateKey);

      // ipfsHash + sha256(pubKey) + version + nonce
      let strToSign = [
        ipfsHash, 
        // SHA256(this.state.pubKey).toString(),
        this.state.pubKey,
        // btoa(this.state.pubKey),
        this.state.ref,
        this.state.version,
        this.state.nonce
      ];
      // console.log('strToSign', strToSign);
      strToSign = strToSign.join('');
      let signature = key.sign(strToSign,'hex');

      this.setState({
        sig: signature
      })
    }


    this.setState({
      fetchingIpfs: true
    })



    // fetch a valid IPFS node's content 

    // window.ipfs.files.cat(ipfsHash,(err,file)=>{
    //   if(err){
    //     return console.error(err);
    //   }
    //   console.log('File:', file);
    // });

    let str;
    let strResult = await fetch('/node/' + ipfsHash,{
      method: 'POST',
    }).then(response=>{
      return response.json();
    }) // window.ipfs.files.cat(ipfsHash);

    if(!strResult.data){

      return this.setState({
        fetchingIpfs: false,
        ipfsStringResult: '',
        ipfsStringPretty: 'Failed finding ipfs Node',
        ipfsObjResult: null
      })

    } else {
      // found string data!
      str = strResult.data;
    }



    // console.log('ipfs result str:', ipfsHash, str);

    // console.log('toString:', str.toString('utf8'));

    // str = str.toString('utf8');

    let parsed = JSON.parse(str);
    console.log('Parsed:', parsed);

    this.setState({
      fetchingIpfs: false,
      ipfsStringResult: str,
      ipfsStringPretty: Stringify(parsed,null,2),
      ipfsObjResult: parsed
    })


  }

  render() {

    // let node = this.props.node;

    let state = this.state;

    const samples = [
      {
        name: 'language node',
        hash: 'QmRsy95CGFESn2HRMfbz7fTicfWLp1mzj2oh7jwzNhek8k',
        content: `{
  "type": "language",
  "data": {
    "name": "text-object",
    "description": "testing text node",
    "schema": {
      "type": "object",
      "properties": {
        "text": {
          "type": "string",
          "required": true
        }
      },
      "additionalProperties": false
    }
  }
}`
      },
      {
        name: 'text node',
        hash: 'QmW6MLzNVorCA6bPgsTxC2podKSxbhgiLpZy13QK81p58Z',
        content: `{
  "type" : "QmRsy95CGFESn2HRMfbz7fTicfWLp1mzj2oh7jwzNhek8k",
  "nodeId" : null,
  "data" : {
    "text": "testing some basic text entry"
  }
}`
      }
    ]

    // validate json (should validate whole schema) 
    // - node is just a jsSchema anyways 
    let validJson;
    try {
      JSON.parse(this.state.nodeInputStr);
      validJson = true;
    }catch(err){

    }


    return (

      <div className="section">
        <div className="container">

          <h3 className="title is-3">
            Append Node to Chain
          </h3>

          <div className="columns">
            <div className="column is-6">


              <div className="field">
                <label className="label">Node Object (type, nodeId, data)</label>
              </div>

              <div className="field">
                <div className="control">
                  <AceEditor
                    ref={r=>this.aceRef=r}
                    mode="jsx"
                    theme="monokai"
                    value={this.state.nodeInputStr}
                    onChange={v=>this.setState({nodeInputStr: v})}
                    name="UNIQUE_ID_OF_DIV2"
                    editorProps={{$blockScrolling: true}}
                    onLoad={editor=>{
                      editor.getSession().setUseWrapMode(true);
                    }}
                    height="200px"
                    width="100%"
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                      showLineNumbers: true,
                      behavioursEnabled: false,
                      showPrintMargin: false,
                      tabSize: 2
                    }}
                  />
                </div>
              </div>

              
              <div className="help">
                Samples:
                <br />
                {
                  samples.map((sample,i)=>(
                    <p key={i}>
                      {sample.name}: <span style={{cursor: 'pointer'}} onClick={e=>this.setState({nodeInputStr: sample.content})}>{sample.hash}</span>
                    </p>
                  ))
                }
              </div>
              


              <hr />


              <div className="field">
                <div className="control">
                  <label className="label">Reference</label>
                  <input 
                    className="input" 
                    type="text" 
                    placeholder=""
                    value={this.state.ref} 
                    onChange={e=>this.setState({ref:e.target.value})} 
                  />
                  <p className="help">
                    for identifying a "common" node (useful in conjunction with a version) 
                  </p>
                </div>
              </div>


              <div className="field">
                <div className="control">
                  <label className="label">Version</label>
                  <input 
                    className="input" 
                    type="number" 
                    placeholder=""
                    value={this.state.version} 
                    onChange={e=>this.setState({version:e.target.value})} 
                  />
                  <p className="help">
                    combo of pubKey+ref+version must be unique (and SHOULD increment!) 
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
                  {/*
                  <p className="help">
                    this Public Key must be able to create nodes (<Link to="/keys">view keys</Link>)
                  </p>
                  */}
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <label className="label">Nonce</label>
                  <input 
                    className="input" 
                    type="text" 
                    placeholder=""
                    value={this.state.nonce} 
                    onChange={e=>this.setState({nonce:e.target.value})} 
                  />
                  <p className="help">
                    unique value
                  </p>
                </div>
              </div>


              <div className="field">
                <div className="control">
                  <label className="label">Signature (ipfsHash + pubKey + version + nonce)</label>
                  <input 
                    className="input" 
                    type="text" 
                    placeholder=""
                    value={this.state.sig} 
                    onChange={e=>this.setState({sig:e.target.value})} 
                  />
                  <p className="help">
                    required when submitting node
                  </p>
                </div>
              </div>


              <div className="field">
                <div className="control">
                  <label className="label">Private Key (optional, if signature not provided)</label>
                  <textarea 
                    className="textarea" 
                    type="text" 
                    placeholder=""
                    value={this.state.privateKey} 
                    onChange={e=>this.setState({privateKey:e.target.value})} 
                  />
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <label className="label">Chain Public Key</label>
                  <textarea 
                    className="textarea" 
                    type="text" 
                    placeholder=""
                    value={this.state.chainPubKey} 
                    onChange={e=>this.setState({chainPubKey:e.target.value})} 
                    readOnly
                    style={{background:'#fafafa'}}
                  />
                  <p className="help">
                    This identifies the chain's creator 
                  </p>
                </div>
              </div>


            </div>

            <div className="column">

              <div className="field">
                <label className="label">&nbsp;</label>
              </div>

              <div className="field has-addons">
                <div className="control is-expanded">
                  <input 
                    className="input" 
                    type="text" 
                    placeholder="IPFS Hash of Node"
                    value={this.state.ipfsHash} 
                    readOnly
                    style={{background:'#fafafa'}}
                    onChange={e=>this.setState({ipfsHash:e.target.value})} 
                  />
                  <p className="help">
                    uses <code>json-stable-stringify</code> for deterministic hashes of nodes 
                  </p>
                  <p className="help">
                    also will create signature if private key exists in form
                  </p>
                </div>
                <div className="control">
                  <button className={"button " + (validJson ? 'is-default':'is-danger')} onClick={this.fetchIPFSHash} disabled={!validJson}>
                    {
                      validJson ? 'Generate Hash':'Invalid JSON'
                    }
                  </button>
                </div>
                {
                  !validJson ? '':
                  <div className="control">
                    <button className={'button is-success ' + (this.state.saving ? 'is-loading':'')} onClick={this.saveUpdates}>
                      Add to Chain
                    </button>
                  </div>
                }
              </div>


              <hr />
              {/*
              <div className="field---ignore is-grouped has-text-right">
                <div className="control2">
                  <button className={'button is-success ' + (this.state.saving ? 'is-loading':'')} onClick={this.saveUpdates}>
                    Add to Chain
                  </button>
                </div>
              </div>

              <br />
              */}

              {
                (this.state.triedSave && !this.state.saving) ?
                <div className={"message " + (this.state.saveOk ? 'is-success':'is-danger')}>
                  <div className="message-body">
                    {
                      this.state.saveResult
                    }
                    {
                      this.state.saveResultData ? 
                      <div>
                        View Internal: <Link to={'/node/' + this.state.saveResultData.node._id}>
                          {this.state.saveResultData.node._id}
                        </Link>
                        <div>
                          Node Data: <a href={"https://ipfs.io/ipfs/" + this.state.saveResultData.ipfsHash}>{this.state.saveResultData.ipfsHash}</a>
                        </div>
                        <div>
                          Chain Entry Data: <a href={"https://ipfs.io/ipfs/" + this.state.saveResultData.ledgerHash}>{this.state.saveResultData.ledgerHash}</a>
                        </div>
                      </div>
                      :''
                    }
                  </div>
                </div>
                :''
              }

              <br />


              {/*
                this.state.fetchingIpfs ? 
                  <div>
                    <i>
                      Fetching IPFS node content
                      <br />
                      <br />
                      If this takes too long, you may need to pin your node temporarily 
                      <br />
                      <br />
                      Or try visiting <a href={"https://ipfs.io/ipfs/" + this.state.ipfsHash}>ipfs.io/ipfs/{this.state.ipfsHash}</a> to load into another gateway
                    </i>
                  </div>
                :
                  !this.state.ipfsStringPretty ? 
                  <div>
                    <i>
                      IPFS content will be loaded here for review
                    </i>
                  </div>:''
              */}

              <br />

              {/*
              <div>
                <strong>Nesting Identity Ownership (aka "burner" identities):</strong>
                <br />
<pre><code style={{whiteSpace:'pre-wrap'}}>
{`// Outermost 
// - fully random
let outer = new window.NodeRSA({b:512});
let privateKey = outer.exportKey('private');
let publicKey = outer.exportKey('public');

// nest 1 
// - derived 
let key = window.cryptico.generateRSAKey(PUBLIC_KEY_FROM_ABOVE, 512);
let key2 = new window.NodeRSA(key);
let privateKey = key2.exportKey('private');
let publicKey = key2.exportKey('public');

// to prove I created "nest 1" (and that it was generated from Outer, that I still own)
// - post the publicKey (signed with +"owner") used to generate the privateKey that was compromised 
// - I'm assuming it is hard/impossible to go from "privateKey" -> "passphrase For Generating PrivateKey"? 

// No easy way of proving that nest3 is owned by outermost, without going up-chain the whole way 
`}
</code></pre>
              </div>
            */}


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
  graphql(GQUERY.node.mutation.addNode, {
    name: 'mutate_addNode'
  }),
)(AddComponent);


// AddComponent = withEditManager(AddComponent,{
//   editProp: 'node',
//   fields: ['name','description','type','environment','platform','envRequirements', 'universeCapabilities', 'nodes'],
//   fieldConvertServerOnceFunc: {
//     nodes: v=>{
//       // jsSchema
//       return Stringify(v,null,2);
//     }
//   },
// });
AddComponent = withAuth(AddComponent);

export default AddComponent;
