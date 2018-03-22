import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import {withAuth} from '../common/Auth'


class DirectoryHomeComponent extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
  }

  render() {

    return (
      <div className="section">
        <div className="container">

          <div className="columns">
            <div className="column">


              <div>

                <h2 className="title is-4">
                  Directories
                </h2>
                <h2 className="subtitle is-6">
                  Following are Interfaces and APIs to the various networks/ledgers/databases that Seconds rely on for discovery, communication, agreement, and transactions
                </h2>

              </div>




              <table className="table is-fullwidth">
                <thead>
                  <tr>
                    <th>
                      Name
                    </th>
                    <th>
                      Description
                    </th>
                    <th>
                      Public/Private
                    </th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                    <td>
                      Permanent Public Node Database
                    </td>
                    <td>
                      <div className="content">
                        <p>
                          Collection of Nodes (of different types). These can be filtered by "hosts" that want to only manage a subset of the entire Node database (only Nodes of a certain type/schema, or by an author). 
                        </p>
                        <p>
                        Anyone can add to the database, verify data, etc. Nodes have an author/publicKey. Cost of adding is based on size of data, expiration length. Node ID randomly generated (or at least unique!)
                        </p>
                        <p>
                        Author can be tracked to Identities/Reputation (for cross-chain finding of information...whether to trust a Node, which ones to ignore, etc.) 
                        </p>
                      </div>
                    </td>
                    <td>
                      Public Database
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Logic Nodes Database
                    </td>
                    <td>
                      <div className="content">
                        <p>
                          Collection of Logic Nodes (javascript). These can be filtered by "hosts" that want to only manage a subset of the entire Node database (only Nodes of a certain type/schema, or by an author). 
                        </p>
                        <p>
                          Each Logic Node can be verified (valid Javascript) before being added to chain. 
                        </p>
                        <p>
                          Anyone can add to the database, verify data, etc. Nodes have an author/publicKey. Cost of adding is based on size of data, expiration length. Node ID randomly generated (or at least unique!)
                        </p>
                        <p>
                          Author can be tracked to Identities/Reputation (for cross-chain finding of information...whether to trust a Node, which ones to ignore, etc.) 
                        </p>
                        <p>
                          Versionable, able to directly commit to from Second interface (collaborate on changes and have them immediately avaiable to everyone) 
                        </p>
                      </div>
                    </td>
                    <td>
                      Semi-Public
                      <br />
                      publicly-verifiable software and chain
                      <br />
                      HTTP API for easy access
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Identities (discovery) 
                    </td>
                    <td>
                      <div className="content">
                        <p>
                          Immutable key/value store. Key is wallet/publicKey, Value is a publicKey that can be used to look up transactions (Nodes) in the Node DB. 
                        </p>
                        <p>
                          Possible Transactions: 
                          <br />
                          - New Address for Identity (how to reach/connect) 
                          - Identity Canary (still exists, still OK) 
                          - Identity Compromised (stop trusting me!)
                        </p>
                      </div> 
                    </td>
                    <td>
                      Public Database
                      <br />
                      tangle of identities. append-only 
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <Link to="/language">
                        Schemas (Language)
                      </Link>
                    </td>
                    <td>
                      <div className="content">
                        <p>
                          Immutable key/value store. Key is the name/type (xyz:0.0.1:publicKeyAddressHere). 
                        </p>
                        <p>
                          Anyone can add to the database. Append-only, no overwriting. Potentially limit version updates to a publicKey?
                        </p>
                        <p>
                          Possible Transactions: 
                          <br />
                          - New Schema Type 
                          - New Address for Schema 
                          - Schema author compromised (ignore all) 
                        </p>
                      </div>
                    </td>
                    <td>
                      Public Ledger
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Reputation
                    </td>
                    <td>
                      <div className="content">
                        <p>
                          Provides 
                        </p>
                        <p>
                          Signup for access to database (tracking transactions) 
                        </p>
                        <p>
                          Possible Transactions: 
                          <br />
                          - Add transaction (schema type, data for transaction, parties, score for each)
                        </p>
                      </div>
                    </td>
                    <td>
                      Semi-Public
                      <br />
                      publicly-verifiable software and chain
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Interactions (commands/actions) 
                    </td>
                    <td>
                      <div className="content">
                        <p>
                          The database used by the Smart Assistant for handing "when I say X do Y" commands, based on situations. 
                        </p>
                      </div>
                    </td>
                    <td>
                      Semi-Public
                      <br />
                      publicly-verifiable, anyone can add? 
                    </td>
                  </tr>

                </tbody>
              </table>


            </div>
            <div className="column is-2">


            </div>
          </div>

        </div>

      </div>
    )
  }
}

DirectoryHomeComponent = withAuth(DirectoryHomeComponent);

export default DirectoryHomeComponent;
