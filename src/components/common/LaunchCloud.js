import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'
import _ from 'lodash'

import {withAuth} from '../common/Auth'

const multihash = require('multihashes')
var StellarSdk = require('stellar-sdk');

// var SHA256 = require("crypto-js/sha256");
// window.sha256 = SHA256;
var SHA256 = require('js-sha256').sha256;

const ipfsHashTo32ByteBuffer = function(ipfsHash) {
  let buf = multihash.fromB58String(ipfsHash)
  let digest = multihash.decode(buf).digest
  return digest;
}

class LaunchComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      showBuy: false,
      validating: false,
      stellarSeed: process.env.REACT_APP_CLOUD_STELLAR_SEED,
      username: '',
      passphrase: '',
      confirmPassphrase: '',
      startupZipUrl: 'https://github.com/secondai/bundle_cloud_smart_assistant_default',
      generatingLumens: false,
      lumensMessage: null,
      errorMessages: [],
      validated: false,
      usernameClaimed: null,
      usernameAvailable: null,
      claiming: null,
      horizonPossible: [
        {
          name: 'PubNet (real money)',
          address: 'https://horizon.stellar.org',
          network: 'public'
        },
        {
          name: 'TestNet (for development)',
          address: 'https://horizon-testnet.stellar.org',
          network: 'test'
        }
      ],
      horizonServerAddress: 0 // public or test
    }
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
  }

  @autobind
  updateUsername(e){
    let username = e.target.value.normalize('NFKC').toLowerCase();
    console.log('username:', username);
    this.setState({
      username,
      usernameAvailable: false
    })
  }

  @autobind
  generateStellarSeed(){
    // creates the Stellar seed for your controlling account (NOT identity, for creating identity from this) 
    // - makes the testnet "give me 1000 Lumens" request 

    var stellarServer;
    let horizon = this.state.horizonPossible[this.state.horizonServerAddress];
    switch(horizon.network){
      case 'public':
        StellarSdk.Network.usePublicNetwork();
        stellarServer = new StellarSdk.Server('https://horizon.stellar.org');
        window.stellar = StellarSdk;
        break;
      case 'test':
        StellarSdk.Network.useTestNetwork();
        stellarServer = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        window.stellar = StellarSdk;
        break;
      default:
        return false;
    }

    this.setState({
      generatingLumens: true,
      lumensMessage: null
    });

    // // let pkSeed = crypto.createHash('sha256').update('blah blah this is my custom account').digest(); //returns a buffer
    // let pkSeed = SHA256('testing this out');
    // console.log('pkSeed:', pkSeed);
    // var pair = StellarSdk.Keypair.fromRawEd25519Seed(pkSeed);
    var pair = StellarSdk.Keypair.random(); //fromRawEd25519Seed(pkSeed);

    this.setState({
      stellarSeed: pair.secret()
    });

    // let stellarKeys = {
    //   private: pair.secret(),
    //   public: pair.publicKey()
    // }
    // console.log('stellarKeys',stellarKeys);

    // Send request to testnet-bot to create sample lumens 
    if(horizon.network != 'test'){
      this.setState({
        generatingLumens: false
      });

      prompt('Copy this Seed/Secret value and back it up (it will only be shown once!)',pair.secret());
      return;
    }

    var url = new URL('https://friendbot.stellar.org/'),
      params = { addr: pair.publicKey() };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))


    fetch(url)
    .then(response=>{
      console.log('Response1:', response);
      if(response.status == 200){
        return response;
      }
      // failed!
      this.setState({
        generatingLumens: false,
        lumensMessage: 'Failed populating seed wallet'
      })
      throw "Failed populating seed wallet with Friendbot lumens"
    })
    .then(response=>response.json())
    .then(response=>{
      console.log('Friendbot Response:', response);

      prompt('Funded on TestNet. Copy this Seed/Secret value (it will only be shown once!)',pair.secret());

      this.setState({
        generatingLumens: false
      });

      this.getBalance();

    })
    .catch(err=>{
      console.error('Failed Response', err);
    })



    // }, function(error, response, body) {
    //   if (error || response.statusCode !== 200) {
    //     console.error('ERROR!', error || body);
    //   }
    //   else {
    //     console.log('SUCCESS! You have a new account :)\n', body);
    //   }


    //   this.setState({
    //     generatingLumens: false
    //   });

    // });


    // // the JS SDK uses promises for most actions, such as retrieving an account
    // stellarServer.loadAccount(stellarKeys.public)
    // .catch(StellarSdk.NotFoundError, function (error) {
    //   throw new Error('The destination account does not exist!');
    // })
    // .then(function(account) {
    //   console.log('Balances for account: ' + stellarKeys.public);
    //   account.balances.forEach(function(balance) {
    //     console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
    //   });
    // });


    // // // Run a transaction FROM the target (needs to be sent money, then send money out?) 
    // let pkTargetSeed = crypto.createHash('sha256').update('testing103').digest(); //returns a buffer
    // var pairTarget = StellarSdk.Keypair.fromRawEd25519Seed(pkTargetSeed);

    // let stellarKeysTarget = {
    //   private: pairTarget.secret(),
    //   public: pairTarget.publicKey()
    // }

    // console.log('stellarKeysTarget',stellarKeysTarget);

    // // get transactions for Target

    // var destinationId = stellarKeysTarget.public;

    // // Transaction will hold a built transaction we can resubmit if the result is unknown.
    // var transaction;


    // // // the JS SDK uses promises for most actions, such as retrieving an account
    // // stellarServer.loadAccount(destinationId)
    // // .catch(StellarSdk.NotFoundError, function (error) {
    // //   console.error('The destination account does not exist! (expected when creating new identity!)');
    // // })
    // // .then(function(account) {
    // //   console.log('Balances for account: ' + stellarKeys.public);
    // //   account.balances.forEach(function(balance) {
    // //     console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
    // //   });
    // // });


    // // First, check to make sure that the destination account exists.

    // const ipfsHashTo32ByteBuffer = function(ipfsHash) {
    //   let buf = multihash.fromB58String(ipfsHash)
    //   let digest = multihash.decode(buf).digest
    //   return digest;
    // }

    // let b32 = ipfsHashTo32ByteBuffer('Qmf4437bCR2cwwpPh6dChwMSe5wuLJz32caf2aZP3xxtNR');

    // let tmp1 = new Buffer('+FYuRGmZIz/e/T0UungCrIbiMCwukMFzPJWAHzsLH84=','base64'); //.toString('hex');
    // console.log('Qmf4437bCR2cwwpPh6dChwMSe5wuLJz32caf2aZP3xxtNR');
    // let digest1 = multihash.encode(tmp1, 'sha2-256');
    // let hash1 = multihash.toB58String(digest1);
    // console.log(hash1);

    // // let b32 = crypto.createHash('sha256').update('test').digest(); //returns a buffer
    // // console.log('b32:', b32.toString('hex'));
    // // let str2 = new Buffer('n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=','base64').toString('hex')
    // // console.log('same?:', str2); //bs58.decode(str2).toString('hex'));

    // // stellarServer.loadAccount(stellarKeys.public)
    // //   // // If the account is not found, surface a nicer error message for logging.
    // //   // .catch(StellarSdk.NotFoundError, function (error) {
    // //   //   throw new Error('The destination account does not exist!');
    // //   // })
    // //   // If there was no error, load up-to-date information on your account.
    // //   // .then(function() {
    // //   //   return stellarServer.loadAccount(stellarKeys.public);
    // //   // })
    // //   .then(function(sourceAccount) {
    // //     // Start building the transaction.
    // //     transaction = new StellarSdk.TransactionBuilder(sourceAccount)
          
    // //       .addOperation(StellarSdk.Operation.createAccount({
    // //         destination: pairTarget.publicKey(),
    // //         startingBalance: "10"
    // //         // source: pair
    // //       }))

    // //       // A memo allows you to add your own metadata to a transaction. It's
    // //       // optional and does not affect how Stellar treats the transaction.
    // //       // .addMemo(StellarSdk.Memo.text('Qmf4437bCR2cwwpPh6dChwMSe5wuLJz32caf2aZP3xxtNR'))
    // //       .addMemo(StellarSdk.Memo.hash(b32))
    // //       .build();
    // //     // Sign the transaction to prove you are actually the person sending it.
    // //     transaction.sign(pair); // sourceKeys
    // //     // send to stellar network
    // //     return stellarServer.submitTransaction(transaction);
    // //   })
    // //   .then(function(result) {
    // //     console.log('Stellar Success! Results:', result);
    // //   })
    // //   .catch(function(error) {
    // //     console.error('Stellar Something went wrong!', error);
    // //     // If the result is unknown (no response body, timeout etc.) we simply resubmit
    // //     // already built transaction:
    // //     // server.submitTransaction(transaction);
    // //   });




    // // // Get the 1st (on page 1 only!) transaction where the memo is an ipfs hash 
    // // stellarServer.transactions()
    // //   .forAccount(destinationId)
    // //   .call()
    // //   .then(function (page) {
    // //     console.log('Page 1: ', page.records.length);
    // //     console.log(JSON.stringify(page.records,null,2));
    // //     // console.log(page.records.length);
    // //   })


  }

  @autobind
  async buyLumens(){

    alert('Not yet available');

  }

  @autobind
  async getBalance(){

    var stellarServer;
    let horizon = this.state.horizonPossible[this.state.horizonServerAddress];
    switch(horizon.network){
      case 'public':
        StellarSdk.Network.usePublicNetwork();
        stellarServer = new StellarSdk.Server('https://horizon.stellar.org');
        window.stellar = StellarSdk;
        break;
      case 'test':
        StellarSdk.Network.useTestNetwork();
        stellarServer = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        window.stellar = StellarSdk;
        break;
      default:
        return false;
    }

    let {
      stellarSeed,
      username,
      passphrase
    } = this.state;

    let currentBalance;

    this.setState({
      gettingBalance: true,
      currentBalance: null
    });

    var pairSource;

    // Load source account
    let sourceAccount;
    try {
      pairSource = StellarSdk.Keypair.fromSecret(this.state.stellarSeed);
      sourceAccount = await stellarServer.loadAccount(pairSource.publicKey())
    }catch(err){
      // problem with account 
      alert('Account does not exist');
      sourceAccount = null;
    }

    // get source balance 
    if(sourceAccount){
      currentBalance = sourceAccount.balances[0].balance;
    }

    this.setState({
      gettingBalance: false,
      currentBalance
    });

  }

  @autobind
  async validate(){

    // validate a username/identity 

    var stellarServer;
    let horizon = this.state.horizonPossible[this.state.horizonServerAddress];
    switch(horizon.network){
      case 'public':
        StellarSdk.Network.usePublicNetwork();
        stellarServer = new StellarSdk.Server('https://horizon.stellar.org');
        window.stellar = StellarSdk;
        break;
      case 'test':
        StellarSdk.Network.useTestNetwork();
        stellarServer = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        window.stellar = StellarSdk;
        break;
      default:
        return false;
    }


    let validated = false;

    let {
      stellarSeed,
      username,
      passphrase
    } = this.state;

    if(!username){
      return false;
    }


    let subname = ''; // empty is for root 
    let usernameSplit = username.split('@');
    if(usernameSplit.length > 1){
      subname = usernameSplit[0];
      username = usernameSplit[1];
    }

    this.setState({
      errorMessages: [],
      validated: false,
      validating: true,
      usernameClaimed: null,
      usernameAvailable: null,
      identityAccountId: null
    });

    let usernameClaimed = null;
    let usernameAvailable = null;

    // validate stellar seed 
    // - an account with enough Lumens in it 

    var pairSource;

    let errors = [];

    // Load source account
    let sourceAccount;
    try {
      pairSource = StellarSdk.Keypair.fromSecret(this.state.stellarSeed);
      sourceAccount = await stellarServer.loadAccount(pairSource.publicKey())
    }catch(err){
      // problem with account 
      errors.push('The seed stellar account does not exist!');
      sourceAccount = null;
    }

    // get source balance 
    if(sourceAccount){
      let balance = 0;
      balance = sourceAccount.balances[0].balance;

      console.log('Balance:', balance);

      balance = parseInt(balance,10);
      if(balance < 10){
        errors.push('Insufficient balance in source account (need 10+ lumens)');
      }
    }

    // validate that Identity is available (or already owned)
    // - should be a nonexistant account (or have my sourcePublicKey as a signer) 
    // - TODO: "rent" via smart contracts 

    let pkTargetSeed = SHA256.array(username);
    var pairTarget = StellarSdk.Keypair.fromRawEd25519Seed(pkTargetSeed);

    this.setState({
      identityAccountId: pairTarget.publicKey()
    });

    let targetAccount;
    try {
      targetAccount = await stellarServer.loadAccount(pairTarget.publicKey())
      console.log('targetAccount:', targetAccount);

      // if reach here, then username is taken! 
      // - check to see if our sourceKeys are a signer (aka I'm the owner) 

      usernameClaimed = {};

      // get the current value of the Second ipfshash 
      let secondHash = await targetAccount.data({key: subname + '|second'})
      .then(function(dataValue) {
        let decoded = atob(dataValue.value);
        return decoded;
      })
      .catch(function (err) {
        return null;
      })

      console.log('secondHash:', secondHash);

      usernameClaimed.hash = secondHash;

      let sourceIsSigner = _.find(targetAccount.signers,{public_key: pairSource ? pairSource.publicKey():'skip'});
      if(sourceIsSigner){
        // already claimed, but I'm the owner 
        usernameClaimed.owned = true;

      } else {
        // exists, and I'm not the owner 
        // - could also check to see if it is unprotected? (unlikely, maybe on testnet only) 
        // - could check the "data.willSellFor" field to see if it is for sale? 
        errors.push('Identity/username already claimed');
        targetAccount = null;

        usernameClaimed.owned = false;

      }

      this.setState({
        usernameClaimed
      });




      // // var pairSource = StellarSdk.Keypair.fromSecret(this.state.stellarSeed);
      // // let pkTargetSeed = SHA256.array(username);
      // // var pairTarget = StellarSdk.Keypair.fromRawEd25519Seed(pkTargetSeed);

      // // Update data 

      // // Start building the transaction.
      // let transaction = new StellarSdk.TransactionBuilder(targetAccount)

      // .addOperation(StellarSdk.Operation.manageData({
      //   name: 'ipfshash',
      //   value: 'Qmf4437bCR2cwwpPh6dChwMSe5wuLJz32caf2aZP3xxtNR'
      // }))

      // // A memo allows you to add your own metadata to a transaction. It's
      // // optional and does not affect how Stellar treats the transaction.
      // // .addMemo(StellarSdk.Memo.text('Qmf4437bCR2cwwpPh6dChwMSe5wuLJz32caf2aZP3xxtNR'))
      // // .addMemo(StellarSdk.Memo.hash(b32))
      // .build();

      // // Sign the transaction to prove you are actually the person sending it.
      // transaction.sign(pairTarget); // sourceKeys
      // transaction.sign(pairSource); // sourceKeys

      // // send to stellar network
      // stellarServer.submitTransaction(transaction)
      // .then(function(result) {
      //   console.log('Stellar manageData Success! Results:', result);
      // })
      // .catch(function(error) {
      //   console.error('Stellar Something went wrong (failed updating data)!', error);
      //   // If the result is unknown (no response body, timeout etc.) we simply resubmit
      //   // already built transaction:
      //   // server.submitTransaction(transaction);
      // });



      // return false;



    }catch(err){
      // account doesnt exist, good!
      console.log('targetAccount doesnt exist, good!');
      usernameAvailable = true;
    }

    if(!errors.length){
      validated = true;
    }

    console.log('errorMessages:', errors);
    console.log('validated:', validated);

    this.setState({
      validating: false,
      validated,
      errorMessages: errors,
      usernameAvailable
    });

  }

  @autobind
  async claimUsername(username){
    // sets up the identity
    // - assuming NOT setup at all yet 
    // - error if already created 

    // also sets up multi-sig control over data! 


    // validate stellar seed 
    // - an account with enough Lumens in it 

    var stellarServer;
    let horizon = this.state.horizonPossible[this.state.horizonServerAddress];
    switch(horizon.network){
      case 'public':
        StellarSdk.Network.usePublicNetwork();
        stellarServer = new StellarSdk.Server('https://horizon.stellar.org');
        window.stellar = StellarSdk;
        break;
      case 'test':
        StellarSdk.Network.useTestNetwork();
        stellarServer = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        window.stellar = StellarSdk;
        break;
      default:
        return false;
    }

    this.setState({
      claiming: true
    });


    let subname = ''; // empty is for root 
    let usernameSplit = username.split('@');
    if(usernameSplit.length > 1){
      subname = usernameSplit[0];
      username = usernameSplit[1];
    }

    var pairSource = StellarSdk.Keypair.fromSecret(this.state.stellarSeed);

    let errors = [];

    // Load source account
    let sourceAccount;
    try {
      sourceAccount = await stellarServer.loadAccount(pairSource.publicKey())
    }catch(err){
      // problem with account 
      alert('The seed stellar account does not exist!');

      this.setState({
        claiming: false
      });
      return false;
    }

    // get source balance 
    if(sourceAccount){
      let balance = 0;
      balance = sourceAccount.balances[0].balance;

      console.log('Balance:', balance);

      balance = parseInt(balance,10);
      if(balance < 10){
        alert('Insufficient balance in source account (need 10+ lumens)');

        this.setState({
          claiming: false
        });

        return false;
      }
    }

    // validate that Identity is available (or already owned)
    // - should be a nonexistant account (or have my sourcePublicKey as a signer) 
    // - TODO: "rent" via smart contracts 

    let pkTargetSeed = SHA256.array(username);
    var pairTarget = StellarSdk.Keypair.fromRawEd25519Seed(pkTargetSeed);

    let targetAccount;
    try {
      targetAccount = await stellarServer.loadAccount(pairTarget.publicKey())
      console.log('targetAccount:', targetAccount);
      alert('Identity already exists, cant claim');

      this.setState({
        claiming: false
      });

      return false;
    }catch(err){

    }

    // Start building the transaction.
    // - fees: https://www.stellar.org/developers/guides/concepts/fees.html
    // - starting balance: (2 + # of entries) × base reserve
    //   - 2 signers (original, my secret) 
    //   - 1 Data entry 
    let transaction = new StellarSdk.TransactionBuilder(sourceAccount)
    .addOperation(StellarSdk.Operation.createAccount({
      destination: pairTarget.publicKey(),
      startingBalance: "5.0" // 2.5 is required, 2.5 extra for manageData entries (allows for 4 entries? second, nodechain, ...) 
      // source: pair
    }))

    // A memo allows you to add your own metadata to a transaction. It's
    // optional and does not affect how Stellar treats the transaction.
    // .addMemo(StellarSdk.Memo.text('Qmf4437bCR2cwwpPh6dChwMSe5wuLJz32caf2aZP3xxtNR'))
    // .addMemo(StellarSdk.Memo.hash(b32))
    .build();

    // Sign the transaction to prove you are actually the person sending it.
    transaction.sign(pairSource); // sourceKeys

    // send to stellar network
    let stellarResult = await stellarServer.submitTransaction(transaction)
    .then(function(result) {
      console.log('Stellar Success! Results:', result);
      return result;
    })
    .catch(function(error) {
      console.error('Stellar Something went wrong!', error);
      // If the result is unknown (no response body, timeout etc.) we simply resubmit
      // already built transaction:
      // server.submitTransaction(transaction);
      return null;
    });

    console.log('stellarResult', stellarResult);
    if(!stellarResult){
      alert('Failed claiming account');

      this.setState({
        claiming: false
      });

      return false;
    }


    targetAccount = await stellarServer.loadAccount(pairTarget.publicKey())

    // Add multisig 
    console.log('adding multisig', targetAccount);

    // set multi-sig on this account 
    // - will fail if I am unable to "claim" 

    // Start building the transaction.
    let transaction2 = new StellarSdk.TransactionBuilder(targetAccount)

    .addOperation(StellarSdk.Operation.manageData({
      name: '|second',
      value: '-'
    }))

    .addOperation(StellarSdk.Operation.setOptions({
      signer: {
        ed25519PublicKey: pairSource.publicKey(),
        weight: 1
      }
    }))
    .addOperation(StellarSdk.Operation.setOptions({
      masterWeight: 1, // set master key weight (should really be nothing, and controlled by this other key?) 
      lowThreshold: 2, // trustlines
      medThreshold: 2, // manageData
      highThreshold: 2  // setOptions (multi-sig)
    }))
    .build();

    // Sign the transaction to prove you are actually the person sending it.
    transaction2.sign(pairTarget); // sourceKeys
    // transaction2.sign(pairSource); // sourceKeys

    // send to stellar network
    let stellarResult2 = await stellarServer.submitTransaction(transaction2)
    .then(function(result) {
      console.log('Stellar MultiSig Setup Success! Results:', result);
      return result
    })
    .catch(function(error) {
      console.error('Stellar Something went wrong (failed multisig)!', error);
      // If the result is unknown (no response body, timeout etc.) we simply resubmit
      // already built transaction:
      // server.submitTransaction(transaction);
      return null;
    });

    console.log('Multisig result:', stellarResult2);

    if(!stellarResult2){
      alert('Failed multisig setup');

      this.setState({
        claiming: false
      });

      return false;
    }

    alert('Claimed Username');

    // re-run validation (to verify changes worked!) 
    await this.validate();

    this.setState({
      claiming: false
    });

    return true;

  }

  @autobind
  async launch(){

    // check passwords
    if(this.state.passphrase != this.state.confirmPassphrase){
      alert('Passwords do not match');
      return false;
    }

    // Claim the username if necessary 
    if(this.state.usernameClaimed){
      // username was claimed 
      if(this.state.usernameClaimed.owned){

        console.log('Already claimed (will be updating when Second launches)');

      } else {
        alert('Cannot launch with identity you cant control');
        return false;
      }

    } else {

      // Setup the account (assuming it hasn't been setup before) 

      let claimed = await this.claimUsername(this.state.username);

      console.log('Claimed result:', claimed);


    }


    let launchUrl = 'https://heroku.com/deploy';

    let horizon = this.state.horizonPossible[this.state.horizonServerAddress];

    var url = new URL(launchUrl),
      params = { 
        template: 'https://github.com/secondai/env_cloud_default/tree/master',
        'env[STELLAR_SEED]': this.state.stellarSeed,
        'env[STELLAR_NETWORK]': horizon.network,
        'env[BASICS_ZIP_URL]': this.state.startupZipUrl,
        'env[STARTUP_REACHABLE_WORDS]': this.state.username,
        'env[DEFAULT_PASSPHRASE]': this.state.passphrase,
      };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))


    console.log('launching in new window!', url.toString());
    return false;

    window.open(url.toString());

  }

  render() {

    return [
      <section key={1} className="section">
        <div className="container">
          <div className="columns">

            <div className="column is-offset-3 is-6 has-text-center">

              <div className={"modal " + (this.state.showBuy ? 'is-active':'')}>
                <div className="modal-background" onClick={e=>this.setState({showBuy:false})}></div>
                <div className="modal-content">
                  <div className="box content">

                    <h3 className="title is-4">
                      Purchase how many usernames?
                    </h3>

                    <p>
                      <a href="/cloud" className="button">1 Username - $1</a>
                    </p>
                    <p>
                      <a href="/cloud" className="button">3 Usernames - $2.75</a>
                    </p>
                    <p>
                      <a href="/cloud" className="button">10 Usernames - $8.50</a>
                    </p>

                  </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={e=>this.setState({showBuy:false})}></button>
              </div>

              <h3 className="title is-3">
                Launch a Cloud Second 
              </h3>

              <p>
                Register a username and configure the variables when launching your Cloud Second 
              </p>

              <hr />


              <div className="field">
                <label className="label">Identity (username/namespace/domain)</label>
              </div>

              <div className="field has-addons" style={{marginBottom:'0px'}}>
                <div className="control is-expanded">
                  <input autoFocus className="input" type="text" placeholder="lowercase values only" value={this.state.username} 
                    onChange={this.updateUsername} 
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        this.validate()
                      }
                    }}
                    />
                </div>
                
                {
                  !this.state.usernameAvailable ? '':
                  <div className="control">
                    <button className={"button is-success " + (this.state.claiming ? 'is-loading':'') } onClick={e=>this.claimUsername(this.state.username)}>Claim Immediately</button>
                  </div>
                }

                <div className="control">
                  <button className={"button is-info " + (this.state.validating ? 'is-loading':'') } onClick={this.validate}>Check Username</button>
                </div>

              </div>

              <div className="field">

                <p className="help">
                  This is what you'll give out when you want someone to connect to your Second, or to a website that you own. It is globally unique. 
                  <br />
                  Normalized using <a href="http://www.unicode.org/reports/tr36/#Recommendations_General" target="_blank">Unicode Technical Report 36</a> (<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize" target="_blank">String.prototype.normalize('NFKC').toLowerCase()</a>)
                </p>

                {
                  !this.state.usernameAvailable ? '':
                  <p className={"help has-text-success"}>
                    Username available (unregistered)
                  </p>
                }

                {
                  !this.state.identityAccountId ? '':
                  <p className="help">
                    Account: <a href={`${this.state.horizonPossible[this.state.horizonServerAddress].address}/accounts/${this.state.identityAccountId}`} target="_blank">{this.state.identityAccountId}</a>
                  </p>
                }
                {
                  !this.state.usernameClaimed ? '':
                  <p className={"help " + (this.state.usernameClaimed.owned ? 'has-text-success':'has-text-danger')}>
                    Current Second Hash:&nbsp;
                    {
                      this.state.usernameClaimed.hash ?
                        <a href={`https://ipfs.io/ipfs/${this.state.usernameClaimed.hash}`} target="_blank">{this.state.usernameClaimed.hash}</a>
                      :
                        <i>missing</i>
                    }
                    &nbsp;
                    (<a href="/">view all identity records</a>)
                    <br />
                    {
                      this.state.usernameClaimed.owned ?
                      'You are the owner already! Continuing will eventually overwrite the previous configuration for this username'
                      :
                      <div>
                        You are NOT the owner of this username
                        <br />
                        <strong className="has-text-danger">This username is available for rent/purchase (<a href="/">view</a>)</strong>
                      </div>
                    }
                  </p>
                }

              </div>


              <div className="field">
                <label className="label">Seed</label>
              </div>

              <div className="field has-addons" style={{marginBottom:'0px'}}>
                <div className="control is-expanded has-icons-right">
                  <input className="input" type="text" placeholder="" value={this.state.stellarSeed} onChange={e=>this.setState({stellarSeed: e.target.value})} />
                  {
                    this.state.generatingLumens ?
                    <span className="icon is-small is-right has-text-info">
                      <i className="fa fa-spinner fa-pulse"></i>
                    </span>:''
                  }
                </div>
                
                <div className="control">
                  <button className={"button is-default " + (this.state.gettingBalance ? 'is-loading':'')} onClick={this.getBalance}>Get Balance {
                    this.state.currentBalance
                  }</button>
                </div>

                <div className="control">
                  <button className={"button is-default"} onClick={e=>this.setState({showBuy:true})}>No Lumens? Buy Some!</button>
                </div>
                
              </div>

              <div className="field">
                {/*
                <label className="label">Stellar Seed</label>
                <div className="control has-icons-right">
                  <input className="input" type="text" placeholder="" value={this.state.stellarSeed} onChange={e=>this.setState({stellarSeed: e.target.value})} />
                  {
                    this.state.generatingLumens ?
                    <span className="icon is-small is-right has-text-info">
                      <i className="fa fa-spinner fa-pulse"></i>
                    </span>:''
                  }
                </div>*/}
                {
                  !this.state.lumensMessage ? '':
                  <p className="help has-text-danger">
                    {this.state.lumensMessage}
                  </p>
                }
                <p className="help">
                  This must be an account with enough Lumens to create a new account (3.0). <a onClick={this.generateStellarSeed}>generate seed</a> (funds on testnet)
                  <br />
                  Losing this Seed value means losing ALL access to your username. There is no recovery mechanism, and no amount of money you can pay to get it back. Store it somewhere secure. 
                </p>
              </div>


              <div className="field">
                <label className="label">Admin Passphrase</label>
                <div className="control">
                  <input className="input" type="password" placeholder="" value={this.state.passphrase} onChange={e=>this.setState({passphrase: e.target.value})} />
                </div>
                <p className="help">
                  This is the passphrase you'll use for full and complete access (you'll add additional users/permissions later) 
                </p>
              </div>

              <div className="field">
                <label className="label">Confirm Admin Passphrase</label>
                <div className="control">
                  <input className="input" type="password" placeholder="" value={this.state.confirmPassphrase} onChange={e=>this.setState({confirmPassphrase: e.target.value})} />
                </div>
              </div>


              <div className="field">
                <label className="label">Network</label>
                {
                  this.state.horizonPossible.map((horizon,i)=>(
                    <div key={i} className="control">
                      <label className="radio">
                        <input type="radio" name="answer" value={i} onChange={e=>this.setState({horizonServerAddress: e.target.value})} checked={(this.state.horizonServerAddress == i)} />
                        &nbsp;{horizon.name}
                      </label>
                    </div>
                  ))
                }
              </div>


              <div className="field">
                <label className="label">Startup Bundle Zip URL</label>
                <div className="control">
                  <input className="input" type="text" placeholder="" value={this.state.startupZipUrl} onChange={e=>this.setState({startupZipUrl: e.target.value})} />
                </div>
                <p className="help">
                  The default bundle of Nodes to use when launching a Cloud Second
                </p>
              </div>


              <br />

              <div className="field is-grouped">
                {/*
                <div className="control">
                  <button className={"button is-default " + (this.state.validating ? 'is-loading':'') } onClick={this.validate}>Check Username</button>
                </div>
                */}

                {
                  (!this.state.validated || (this.state.usernameClaimed && this.state.usernameClaimed.owned == false)) ? 
                    <div className="control">
                      <button className={"button is-default"} disabled={true}>Validate Username Before Continuing</button>
                    </div>
                  :
                    <div className="control">
                      <button className={"button is-info"} onClick={this.launch}>{!this.state.usernameClaimed ? 'Claim Username and ':''}Continue to Heroku</button>
                    </div>
                }

              </div>

              {
                !this.state.errorMessages.length ? '':
                <div className="message is-danger">
                  <div className="message-body">
                    {
                      this.state.errorMessages.map((msg,i)=>(
                        <div key={i + msg}>
                          {msg}
                        </div>
                      ))
                    }
                  </div>
                </div> 
              }

              <br />

              <p>
                After creating, visit the <a href="https://browserapp.getasecond.com">browser app</a>* to connect to your Cloud Second using your created username and password
                <br />
                <small>
                  * eventually your Second will host the app
                </small>
              </p>

            </div>
          </div>
        </div>

      </section>

    ]
  }
}

LaunchComponent = withAuth(LaunchComponent);

export default LaunchComponent;
