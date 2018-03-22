import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'
import _ from 'lodash'

import ReactTable from 'react-table'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import {withAuth} from '../../../common/Auth'
import GQUERY from '../../../../graphql'

import Emojify from 'react-emojione'
import shortnames from '../../../common/emoji-shortnames'

// import Detail from './mark/Detail'
import ListItem from './ListItem'


class ListComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      datetime: 0
    }
  }

  componentDidMount(){
    // window.setInterval(()=>{
      // console.log('Refetcing');
      // this.props.data.refetch();
      // this.setState({
      //   datetime: (new Date()).getTime()
      // })
    // },3000)
  }

  render() {

    let pointers = this.props.data.viewer ? this.props.data.viewer.pointer.many:null;

    if(!pointers && this.props.data.loading){
      return (
        <div>
          Loading
        </div>
      )
    }

    console.log('EMOJIS:', shortnames);
    
    let emojis = {};
    let emojiList = _.filter(pointers,{type: 'emoji'});
    emojiList.map(tmpE=>{
      let e = tmpE.data.emoji;
      if(!emojis[e]){
        emojis[e] = 0;
      }
      emojis[e]++;
    })

    let tags = {};
    let tagList = _.filter(pointers,{type: 'tag'});
    tagList.map(tmpTag=>{
      let tag = tmpTag.data.tag;
      if(!tags[tag]){
        tags[tag] = {
          count: 0,
          mine: false
        }
      }
      if(tmpTag.createdByUser._id == this.props.auth.user._id){
        tags[tag].mine = true;
      }
      tags[tag].count++;
    })
    let textList = _.filter(pointers,{type: 'text'});

    return (
      <div className="pointer-list">

        {/* Put emojis/tags at the top! */}
        <div className="emoji-bar">
          {
            Object.keys(emojis).map(emoji=>(
              <div className="emoji-item" key={emoji}>
                <Emojify style={{height: 28, width: 28}}>
                  {`:${emoji}:`}
                </Emojify>
                <span className="emoji-count">
                  {emojis[emoji]}
                </span>
              </div>
            ))
          }
        </div>

        <div className="tag-bar">

          <div className="tag-groups">
            <div className="field is-grouped is-grouped-multiline">

              {
                Object.keys(tags).map(tagName=>(
                  <div className="control" key={tagName}>
                    {
                      tags[tagName].mine ?
                        <div className="tags has-addons">
                          <span className="tag is-info">{tagName}</span>
                          <span className="tag is-light">{tags[tagName].count}</span>
                          <span className="tag is-light is-delete"></span>
                        </div>
                      :
                        <div className="tags has-addons">
                          <span className="tag is-dark">{tagName}</span>
                          <span className="tag is-light">{tags[tagName].count}</span>
                          <span className="tag is-light " style={{padding:'0px'}}>
                            <span className="icon">
                              <i className="fa fa-plus"></i>
                            </span>
                          </span>
                        </div>
                    }
                  </div>
                ))
              }
              {
                Object.keys(tags).length ? '':
                <span>
                  No Tags
                </span>
              }

            </div>
          </div>

        </div>

        <div>
          {
            textList.map(pointer=>{
              return (
                <ListItem 
                  key={pointer._id} 
                  pointer={pointer}
                  />
              )
            })
          }
        </div>

        <div style={{padding: '8px',borderBottom:'1px solid #eee'}}>
          this is searchable text for this thing
          <br />
          <small>created by nick.reed - a few seconds ago</small>
        </div>

        <div style={{padding: '8px',borderBottom:'1px solid #eee'}}>
          more searchable text
          <br />
          <small>created by nick.reed - 2 hours ago</small>
        </div>


        <div style={{padding: '8px',borderBottom:'1px solid #eee'}}>
          On-Page Note: (visit page to see the context (via a jquery selector) of this text) 
          <br />
          <small>created by nick.reed - a few seconds ago</small>
        </div>


        <div className="add-metadata">
          <button className="button">
            Add Metadata
          </button>
        </div>

      </div>
    )
  }
}

ListComponent = withAuth(ListComponent);

ListComponent = compose(
  // Private
  graphql(GQUERY.pointer.query.pointers, {
    name: 'data',
    // skip: props => !props.match.params.subjectId,
    options: props => ({
      variables: {
        filter: {
          subjectId: props.subject._id,
          active: true
        }
      }
    })
  }),
)(ListComponent);


const style = {
  emojiBar: {
    borderTop:'1px solid #ddd',
    borderBottom:'1px solid #ddd'
  }
}


export default ListComponent;
