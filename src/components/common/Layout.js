import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'

import {withAuth} from './Auth'

class DefaultLayout extends Component {
  constructor(props){
    super(props)
  }

  render(){
    const { component: Component, ...rest } = this.props;

    return (
      <Route {...rest} render={matchProps => (
        <div className="DefaultLayout">
          <Header />
            <Component {...matchProps} />
          {/*<Footer />*/}
        </div>
      )} />
    )
  }
};

DefaultLayout = withAuth(DefaultLayout);

export default DefaultLayout;
