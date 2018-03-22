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

import {Treebeard, decorators} from 'react-treebeard';

const ReactMarkdown = require('react-markdown')


// Example: Customising The Header Decorator To Include Icons
decorators.Header = ({style, node}) => {
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};

    return (
        <div style={style.base}>
            <div style={style.title}>
              <span className="icon" style={iconStyle}>
                <i className={iconClass} />
              </span>
              {node.name}
            </div>
        </div>
    );
};

decorators.Toggle = (props) => {
  return (
    <span>
    </span>
  );
};


class MarketViewComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      nodeTree: {
        name: 'root'
      }
    }
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
    this.updateTreeData();
  }
  componentWillReceiveProps(nextProps){
    this.updateTreeData(nextProps);
  }

  @autobind
  updateTreeData(props){
    props = props || this.props;

    let crate = props.crate;

    let nodeTree = {
        name: '_',
        toggled: true,
        children: [
        ]
    };

    function updateTreeData(tree, nodes){
      nodes.forEach(node=>{
        let tnode = {
          name: node.type,
          toggled: false
        }
        tree.children.push(tnode);
        if(node.nodes && node.nodes.length){
          tnode.toggled = true;
          tnode.children = [];
          updateTreeData(tnode, node.nodes);
        }
      })
    }
    updateTreeData(nodeTree, crate.nodes);

    this.setState({
      nodeTree: nodeTree.children
    })

  }

  @autobind
  handleFocus(e){
    e.target.select();
  }

  @autobind
  handleCopy(){

    let crate = this.props.crate;

    copy('bundle:' + crate._id);

    toast.info("Copied bundle ID")

  }

  @autobind
  onToggle(node, toggled){
      if(this.state.cursor){
        this.state.cursor.active = false;
      }
      node.active = true;
      if(node.children){ 
        node.toggled = toggled; 
      }
      this.setState({ cursor: node });
  }

  render() {

    let crate = this.props.crate;

    let treedata = this.state.nodeTree;

    return (
      <div className="section">
        <div className="container">

          <div className="columns">
            <div className="column min-width">

              <h2 className="title is-6">
                <a onClick={e=>window.history.back()}>
                  Marketplace &gt; Bundle
                </a>
              </h2>
              <h2 className="title is-4">
                {crate.name}
                <Link className="button pull-right" to={'/market/package/edit/' + crate._id + '/' + crate.name}>
                  Edit
                </Link>
              </h2>
              <h2 className="subtitle is-6">
                {crate.description}
              </h2>

              <hr />

              {/*
              <h2 className="title is-5">
               Usage / Social Proof 
              </h2>
              <p>
                ...
              </p>


              <br />
              <br />


              <h2 className="title is-5">
                Technical Details 
              </h2>
              
              <h2 className="title is-6">
                Environment Requirements
              </h2>
              <p>
                ...
              </p>


              <br />
              <br />

              */}

              <h2 className="title is-6">
                Environment Requirements: 
              </h2>
              <pre style={{padding:'4px'}}><div className="content"><ReactMarkdown source={crate.envRequirements} /></div></pre>

              <br />
              <br />


              <h2 className="title is-6">
                Nodes Included:
              </h2>
              <Treebeard
                  data={treedata}
                  decorators={decorators}
                  onToggle={this.onToggle}
              />
              {/*<pre><code>{JSON.stringify(crate.nodes, null, 2)}</code></pre>*/}

              <br />
              <br />

              {/*
              <h2 className="title is-6">
                Details/Features
              </h2>
              <div className="content">

                <p>
                  This is the default setup for a generic cloud instance. It includes a few basic elements: 
                </p>

                <ul>
                  <li>
                    Identity stored on-chain 
                  </li>
                  <li>
                    Basic smart assistant?
                  </li>
                </ul>

              </div>
              */}



            </div>
            <div className="column is-4 is-offset-1">

              <div className="field has-addons">
                <div className="control">
                  <input className="input" type="text"
                    value={'bundle:' + crate._id} 
                    readOnly
                    onFocus={this.handleFocus}
                  />
                </div>
                <div className="control">
                  <button className="button" onClick={this.handleCopy}>
                    <span className="icon">
                      <i className="fa fa-clipboard"></i>
                    </span>
                  </button>
                </div>


                <div className="control">
                  <div className="dropdown is-hoverable is-right">
                    <div className="dropdown-trigger">
                      <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span>Deploy To:</span>
                        <span className="icon is-small">
                          <i className="fa fa-angle-down" aria-hidden="true"></i>
                        </span>
                      </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                      <div className="dropdown-content">
                        <a href="#" className="dropdown-item">
                          <span style={{fontFamily:'courier'}}>
                            my cloud environment somwhere
                          </span>
                        </a>
                        <hr className="dropdown-divider" />
                        <a href="#" className="dropdown-item">
                          Signup for Cloud Environment
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <ToastContainer
                hideProgressBar={true}
                autoClose={2500}
              />



              <br />
              <br />


            </div>
          </div>

        </div>

      </div>
    )
  }
}

MarketViewComponent = withAuth(MarketViewComponent);

export default MarketViewComponent;
