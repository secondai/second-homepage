import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'


import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';


//Providers
import { ApolloProvider } from 'react-apollo';
import {AuthProvider} from './components/common/Auth'

// Pages and Layouts
import DefaultLayout from './components/common/Layout'
import Welcome from './components/common/Welcome'
// import LaunchCloud from './components/common/LaunchCloud'
// import LaunchCloudAdvanced from './components/common/LaunchCloudAdvanced'

// help/collaborate page
import Help from './components/help/Help'
import Developers from './components/common/Developers'

// language (eventually on-chain)  
import LanguageDashboard from './components/language/dashboard/Dashboard'
import LanguageView from './components/language/view/View'

// identity (on-chain) 
import IdentityDashboard from './components/identity/Home'

// Directories 
import DirectoryDashboard from './components/directory/Home'

// Nodes
import NodeHome from './components/node/home/Home'
import NodeView from './components/node/view/View'
import NodeAdd from './components/node/add/Add'

// Keys
import KeyHome from './components/key/home/Home'
import KeyAdd from './components/key/add/Add'

// Market 
import MarketHome from './components/market/home/Home'
// import MarketCloud from './components/market/Cloud'
import MarketPackageView from './components/market/view/View'
import MarketPackageEdit from './components/market/edit/Edit'

// const wsLink = new WebSocketLink({
//   uri: `ws://acme.etteapp.test:81/subscriptions`,
//   options: {
//     reconnect: true,
//     // connectionParams: {
//     //     authToken: user.authToken,
//     // },
//   }
// });


// // OrbitDB uses Pubsub which is an experimental feature
// // and need to be turned on manually. 
// // Note that these options need to be passed to IPFS in 
// // all examples in this document even if not specfied so.
// const ipfsOptions = {
//   repo: (Math.random() + Date.now()).toString(),
//   EXPERIMENTAL: {
//     pubsub: true
//   },
//   config: {
//     "Addresses": {
//       "Swarm": [
//         // "/ip4/0.0.0.0/tcp/4002",
//         // "/ip4/127.0.0.1/tcp/4003/ws",
//         "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
//       ],
//     },
//     "Discovery": {
//       "MDNS": {
//         "Enabled": false,
//         "Interval": 10
//       },
//       "webRTCStar": {
//         "Enabled": true
//       }
//     },
//     "Bootstrap": [
//     "/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
//     "/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
//     "/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM",
//     "/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu",
//     "/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
//     "/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64",
//     "/dns4/wss0.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic",
//     "/dns4/wss1.bootstrap.libp2p.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6",
//     //   "/ip4/104.236.176.52/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z",
//     //   "/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
//     //   "/ip4/104.236.179.241/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM",
//     //   "/ip4/162.243.248.213/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
//     //   "/ip4/128.199.219.111/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu",
//     //   "/ip4/104.236.76.40/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64",
//     //   "/ip4/178.62.158.247/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
//     //   "/ip4/178.62.61.185/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
//     //   "/ip4/104.236.151.122/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx",
//     //   "/ip6/2604:a880:1:20::1f9:9001/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z",
//     //   "/ip6/2604:a880:1:20::203:d001/tcp/4001/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM",
//     //   "/ip6/2604:a880:0:1010::23:d001/tcp/4001/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
//     //   "/ip6/2400:6180:0:d0::151:6001/tcp/4001/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu",
//     //   "/ip6/2604:a880:800:10::4a:5001/tcp/4001/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64",
//     //   "/ip6/2a03:b0c0:0:1010::23:1001/tcp/4001/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
//     //   "/ip6/2a03:b0c0:1:d0::e7:1/tcp/4001/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
//     //   "/ip6/2604:a880:1:20::1d9:6001/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx",
//     //   "/dns4/wss0.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic",
//     //   "/dns4/wss1.bootstrap.libp2p.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6",
//       "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/ipfs/QmVNqmWGV248kCZpJq2yXSYzTQi5the7vxs82HLfZj3tcK" // necessary?
//     ]
//   }
// }

// const IPFS = require('ipfs')
// const OrbitDB = require('orbit-db')
// const ipfs = new IPFS(ipfsOptions)
// window.ipfs = ipfs;


// ipfs.on('ready', async () => {
//   console.log('IPFS ready');
//   // Create OrbitDB instance
//   console.log('Creating orbit instance');
//   const orbitdb = new OrbitDB(ipfs)
//   window.orbitdb = orbitdb;

//   // Create / Open a database
//   console.log('syncing/replicationg orbitdb');

//   try {

//     const db = await orbitdb.log('/orbitdb/QmPp7UDhKeVFmAbECGhMBE6B1AZo8xq7anW4hN5NKks3JK/node-chain-001')

//     window.odb1 = db;

//     await db.load()

//     // Listen for updates from peers
//     db.events.on('replicated', (address) => {
//       console.log('Replicated', address);
//       // console.log(db.iterator({ limit: -1 }).collect())
//     })
//   }catch(err){
//     console.error(err);
//   }


// })


const httpLink = new HttpLink({ 
  uri: (process.env.REACT_APP_API_ADDRESS || 'https://api.getasecond.com') + '/graphql',
  // credentials: 'include',
});


// // using the ability to split links, you can send data to each link
// // depending on what kind of operation is being sent
// const link = split(
//   // split based on operation type
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(query);
//     return kind === 'OperationDefinition' && operation === 'subscription';
//   },
//   wsLink,
//   httpLink,
// );

// graphql client
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});


class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <AuthProvider>
          <Router>
            <Switch>
              <DefaultLayout exact path="/" component={Welcome}/>
              
              {/*<DefaultLayout path="/cloud-advanced" component={LaunchCloudAdvanced}/>
              <DefaultLayout path="/cloud" component={LaunchCloud}/>
              */}

              <DefaultLayout path="/language/:languageSlug" component={LanguageView}/>
              <DefaultLayout path="/language" component={LanguageDashboard}/>

              <DefaultLayout path="/directories" component={DirectoryDashboard}/>

              <DefaultLayout path="/identity" component={IdentityDashboard}/>

              <DefaultLayout path="/market/package/edit/:id/:name?" component={MarketPackageEdit}/>
              <DefaultLayout path="/market/package/:id/:name?" component={MarketPackageView}/>
              <DefaultLayout path="/market" component={MarketHome}/>

              <DefaultLayout path="/nodes/add" component={NodeAdd}/>
              <DefaultLayout path="/node/:id/:name?" component={NodeView}/>
              <DefaultLayout path="/nodes" component={NodeHome}/>

              <DefaultLayout path="/keys/add" component={KeyAdd}/>
              <DefaultLayout path="/keys" component={KeyHome}/>


              <DefaultLayout path="/developers" component={Developers}/>
              <DefaultLayout path="/about" component={Help}/>

            </Switch>
          </Router>
        </AuthProvider>
      </ApolloProvider>
    );
  }
}

export default App;
