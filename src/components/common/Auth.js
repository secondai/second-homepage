import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'

import autobind from 'autobind-decorator'
import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import GQUERY from '../../graphql'

const USER_KEY = 'user_v1';

// Provider
class AuthProvider extends Component {
  constructor(props){
    super(props);

    // load user from localStorage
    let user = localStorage.getItem(USER_KEY);
    if(user){
      try {
        user = JSON.parse(user);
      }catch(err){
        user = null;
      }
    }

    // console.log('Initial User:', user);

    this.state = {
      user: user
    }

  }

  componentWillReceiveProps(nextProps){
    // console.log('nextProps', nextProps);
    if(nextProps.data.viewer){
      // console.log('Me:', nextProps.data.viewer.me);

      let user = nextProps.data.viewer.me;

      this.setState({
        user
      })

      if(!user){
        localStorage.removeItem(USER_KEY);
        // return console.log('no User logged in');
      }
      localStorage.setItem(USER_KEY, JSON.stringify(user));

    }
  }

  @autobind
  updateAuth(){
    console.log('Called updateAuth!');
    // // Updating auth
    // fetch('/auth/me',{
    //   credentials: 'include'
    // })
    // .then(r=> r.json())
    // .then(r => {
    //   console.log('r',r);
    //   let user = r.user;
    //   if(!user){
    //     localStorage.removeItem(USER_KEY);
    //     return console.log('no User logged in');
    //   }
    //   localStorage.setItem(USER_KEY, JSON.stringify(user));
    //   this.setState({
    //     user: user
    //   })
    // })
    this.props.data.refetch();
    return false;
  }

  @autobind
  hasRole(rolename){
    return (this.state.user && this.state.user.roles) ? (this.state.user.roles.indexOf(rolename) > -1) : false
  }

  getChildContext() {
    return {
      auth: {
        update: this.updateAuth,
        hasRole: this.hasRole,
        user: this.state.user
      }
    }
  }
  render() {
    return Children.only(this.props.children)
  }
}

AuthProvider.childContextTypes = {
  auth: PropTypes.any
}

// console.log('GQUERY',GQUERY);
AuthProvider = compose(
  // graphql(GQUERY.user.query.me,{name: 'data'})
)(AuthProvider)

export {AuthProvider}


// Higher Order Component
const withAuth = (WrappedComponent) => {
  return class HOC extends Component {

    // define what is needed from context
    static contextTypes = {
      auth: PropTypes.any
    }

    render() {
      // const { auth, updateAuth } = this.context
      return (
        <WrappedComponent {...this.props} auth={this.context.auth}/>
      )
    }
  }
}

export {withAuth}