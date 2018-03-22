import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../common/Auth'
import GQUERY from '../../../graphql'

import { ToastContainer, toast } from 'react-toastify';
import copy from 'copy-to-clipboard';


class NodeViewComponent extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }
  componentWillReceiveProps(){
    setTimeout(this.updateType,1);
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
    this.updateType();
  }

  @autobind
  async updateType(){
    // Update type from ipfs

    let node = this.props.data.viewer ? this.props.data.viewer.node.byId:null;
    if(!node){
      return;
    }

    // console.log('Fetching type:', node.type);
    // console.log('isOnline:', window.ipfs.isOnline());

    if(!window.ipfs.isOnline()){
      window.ipfs.on('ready',this.updateType);
      return;
    }

    try {

      let str = await window.ipfs.files.cat(node.type);

      str = str.toString('utf8');

      let parsed = JSON.parse(str);
      console.log('Parsed:', parsed);

      this.setState({
        typeJson: parsed
      });
    }catch(err){
      if(node.type != 'language'){
        console.error(err);
        this.setState({
          typeJson: 'language'
        })
      } else {
        this.setState({
          typeJson: 'Unable to parse node.type'
        })
      }
    }

  }

  @autobind
  handleFocus(e){
    e.target.select();
  }

  @autobind
  handleCopy(){

    let node = this.props.data.viewer ? this.props.data.viewer.node.byId:null;

    copy('bundle:' + node._id);

    toast.info("Copied bundle ID")

  }

  render() {

    let node = this.props.data.viewer ? this.props.data.viewer.node.byId:null;

    if(!node || this.props.data.loading){
      return (
        <div className="section">
          <div className="hero is-medium">
            <div className="hero-body has-text-centered">
              Loading
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="section">
        <div className="container">

          <div className="columns">
            <div className="column is-6 min-width">

                    
              <h2 className="title is-4">
                Transaction Information
              </h2>

              <table className="table is-narrow is-striped">
                <tbody>

                  <tr>
                    <td>
                      <strong>ID</strong>
                    </td>
                    <td style={{wordBreak:'break-all',whiteSpace:'normal'}}>
                      {node._id}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Reference</strong>
                    </td>
                    <td style={{wordBreak:'break-all',whiteSpace:'normal'}}>
                      {node.ref}
                    </td>
                  </tr>

                  {/*
                  <tr>
                    <td>
                      &nbsp;
                    </td>
                    <td>
                      <Link to={"/nodes/browse/" + node.ref + '/' + btoa(node.author)}>
                        see messageboard for reference (just use your Second for browsing...) 
                      </Link>
                    </td>
                  </tr>
                  */}

                  <tr>
                    <td>
                      <strong>Node</strong>
                    </td>
                    <td style={{wordBreak:'break-all',whiteSpace:'normal'}}>
                      <a href={"https://ipfs.io/ipfs/" + node.ipfsHash}>{node.ipfsHash}</a>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Chain</strong>
                    </td>
                    <td style={{wordBreak:'break-all',whiteSpace:'normal'}}>
                      <a href={"https://ipfs.io/ipfs/" + node.ipfsHashForThisNode}>{node.ipfsHashForThisNode}</a>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Version</strong>
                    </td>
                    <td style={{wordBreak:'break-all',whiteSpace:'normal'}}>
                      {node.version}
                    </td>
                  </tr>

                  {/*
                  <tr>
                    <td>
                      &nbsp;
                    </td>
                    <td>
                      <Link to={"/nodes/browse/" + node.ref + '/' + btoa(node.author)}>
                        view all versions (7) 
                      </Link>
                    </td>
                  </tr>
                  */}

                  <tr>
                    <td>
                      <strong>Public Key</strong>
                    </td>
                    <td style={{wordBreak:'break-all',whiteSpace:'normal'}}>
                      <pre style={{padding:'4px'}}><code>{node.author}</code></pre>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Nonce</strong>
                    </td>
                    <td style={{wordBreak:'break-all',whiteSpace:'normal'}}>
                      {node.nonce}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Signature</strong>
                    </td>
                    <td style={{wordBreak:'break-all',whiteSpace:'normal'}}>
                      {node.signature}
                    </td>
                  </tr>

                </tbody>
              </table>


            </div>
            <div className="column is-6">

              <h2 className="title is-4">
                Node Data
              </h2>

              Hash: {node.ipfsHash}
              <br />
              <pre><code>{JSON.stringify(JSON.parse(node.package),null,2)}</code></pre>

              <br />

              <strong>Type:</strong> {node.type}
              {
                node.type == 'language' ? '':
                <div>
                  <pre><code>{JSON.stringify(this.state.typeJson,null,2)}</code></pre>
                </div>
              }

            </div>
          </div>

        </div>

      </div>
    )

  }
}

NodeViewComponent = compose(
  graphql(GQUERY.node.query.node, {
    name: 'data',
    options: props => ({
      variables: {
        _id: props.match.params.id
      }
    })
  }),

)(NodeViewComponent);


NodeViewComponent = withAuth(NodeViewComponent);

export default NodeViewComponent;
