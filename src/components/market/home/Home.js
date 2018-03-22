import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import URL from 'url'

import { graphql, compose } from 'react-apollo';
import { withApollo } from 'react-apollo';

import Emojify from 'react-emojione'

import Utils from '../../common/Utils'
import {withAuth} from '../../common/Auth'
import GQUERY from '../../../graphql'

import BundlesList from './bundles/List'
import EnvList from './environments/List'

class MarketDashboardComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      tabKey: 'starter'
    }
  }

  render() {

    // let languages = [];
    // if(this.props.dataBundlesPrivate.viewer){
    //   languages = this.props.dataBundlesPrivate.viewer.language.many;
    // }

    // console.log('languages', languages);

    let tabs = {
      starter: 'Apps',
      env: 'Environments',
      // addons: 'Add-Ons (upgrades, data bundles, smart assistant interactions)',
      // upgrades: 'Upgrades',
      // data: 'Data Bundles',
      // assistant: 'Smart Assistant Interactions'
    }

    return (
      <div className="section">
        <div className="container">

          <div className="columns">
            <div className="column">


              <div className="tabs">
                <ul>
                  {
                    Object.keys(tabs).map(tabKey=>(
                      <li key={tabKey}
                        className={(this.state.tabKey == tabKey) ? 'is-active':''}
                      >
                        <a onClick={e=>this.setState({tabKey})}>
                          {tabs[tabKey]}
                        </a>
                      </li>
                    ))
                  }
                </ul>
              </div>

              {
                this.state.tabKey != 'starter' ? '':
                <BundlesList 
                  loading={this.props.dataBundles.loading} 
                  crates={this.props.dataBundles.loading ? []:(this.props.dataBundles.viewer.crate.many || [])} 
                />
              }

              {
                this.state.tabKey != 'env' ? '':
                <EnvList 
                  loading={this.props.dataEnvironments.loading} 
                  crates={this.props.dataEnvironments.loading ? []:(this.props.dataEnvironments.viewer.crate.many || [])} 
                />
              }


              {/*
              Marketplace
              <br />
              Find interactions for types of data
              <br />
              Browse interactions (code) that you can download to your Second. Request custom-built code from devs. 
              <br />
              <br />
              InteractionDB (that all seconds can reach out to for building a DB of situations that are relevant to them, or at runtime): database of "in X situation (by code running) when Y happens (say "..." or press button Q) do Z"
              <br />
              <br />
              Environments: (mobile, cloud). Deployable Images for Environment. 
              <br />
              - Full images
              <br />
              - capabilities (upgrades) 
              <br />
              - interactions/understanding (smart assistant) 
              */}

            </div>
            <div className="column is-5">

              <div className="notification is-warning">
                <strong>How do I get started?</strong>
                <p>
                  1. Create a Host Environment (cloud, browser, mobile, device) (develop locally or use our platforms) 
                  <br />
                  2. Browse Starter Bundles, choose one, and follow deploy instructions! 
                </p>
              </div>

              <h2 className="title is-5">
                Default Host Environments
              </h2>
              <h2 className="subtitle is-6">
                Developers and Enterprise 
              </h2>

              <div className="content">

                <p>
                  <strong>Cloud</strong> stdenv/cloud
                  <br />
                  <a href="https://bitbucket.org/teamsecond/env_cloud/overview">https://bitbucket.org/teamsecond/env_cloud/overview</a>
                </p>

                <p>
                  <strong>Browser</strong> stdenv/browser
                  <br />
                  <a href="https://bitbucket.org/teamsecond/env_browser/overview">https://bitbucket.org/teamsecond/env_browser/overview</a>
                </p>

                <p>
                  <strong>Mobile</strong> stdenv/mobileapp
                  <br />
                  <a href="https://bitbucket.org/teamsecond/env_nativeapp/overview">https://bitbucket.org/teamsecond/env_nativeapp/overview</a>
                </p>

                <p>
                  <strong>Device</strong> stdenv/device
                  <br />
                  <a href="https://bitbucket.org/teamsecond/env_rpi/overview">https://bitbucket.org/teamsecond/env_rpi/overview</a>
                </p>

              </div>

            </div>
          </div>

        </div>

      </div>

    )
  }
}

MarketDashboardComponent = compose(

  graphql(GQUERY.crate.query.crates, {
    name: 'dataBundles',
    options: {
      variables: {
        filter: {
          type: 'bundle'
        }
      }
    }
  }),

  graphql(GQUERY.crate.query.crates, {
    name: 'dataEnvironments',
    options: {
      variables: {
        filter: {
          type: 'environment'
        }
      }
    }
  }),

  // Public, I've starred (stars are just another sort of metadata?) 
  graphql(GQUERY.crate.mutation.newCrate, {
    name: 'mutate_newCrate'
  }),

)(MarketDashboardComponent);

MarketDashboardComponent = withAuth(MarketDashboardComponent);
MarketDashboardComponent = withApollo(MarketDashboardComponent);


export default MarketDashboardComponent;
