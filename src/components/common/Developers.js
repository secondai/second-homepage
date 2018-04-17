import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import {withAuth} from '../common/Auth'

import YouTube from 'react-youtube'

const createElement = React.createElement
const ReactMarkdown = require('react-markdown')
function getCoreProps(props) {
  return props['data-sourcepos'] ? {'data-sourcepos': props['data-sourcepos']} : {}
}
function Heading(props) {
  // console.log('props', props);
  let coreProps = getCoreProps(props);
  if(props.level <= 4 && !coreProps.id && props.children && props.children.length){
    coreProps.id = slugify(props.children[0].toString());
  }
  return createElement(`h${props.level}`, coreProps, props.children)
}
function slugify(string){
  return string.toLowerCase()
  .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
  .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
  .replace(/^-+|-+$/g, ''); // remove leading, trailing -
}
let renderers = {
  heading: Heading
}

class DevelopersComponent extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    // console.log(this.props);
    // this.props.auth.update();
  }

  render() {

    let menu1 = `
- [Getting Started](#getting-started)  
- [Terminology](#terminology-and-architecture)  
- [Identity and Routing](#identity-and-routing)  
- [Shared Data](#shared-data)  
  - [Examples](#examples-of-common-shared-data-typesschemas)  

    `;

    let md1 = `
### Developer Documentation 

Second is currently a platform and tooling for building personalized apps much faster. Second eliminates many of the obstacles for common app development (infrastructure, APIs, authentication, data storage, deployment, distribution) without introducing external dependencies, and help you focus on what matters: building amazing apps. 

---- 
`;
    let md2 = `

### Getting Started  

It is recommended that you read the [technical roadmap](/about#technical-roadmap) to understand where Second currently is, and the [Terminology and Architecture](#terminology-and-architecture) before getting started. 

1. Launch a Cloud Second  
2. Launch the Browser App Store and connect to your Second  
3. Install the Social app from the default App Store  



### Terminology and Architecture  

These are the important primitives in Second, and where Second differs from existing approaches. 


__Platform__  

The platform defines where the Second is running; in the cloud, in a browser, mobile app, IoT device, etc. Each platform provides a common environment for running/hosting the Second, with similar, limited capabilities. 

The platform requires a connection to a MongoDB-like database (the \`universe\`) and a JavaScript VM. 


__Universe__  

The universe is all of the data and logic stored inside your Second's database. When code is run inside your Second's JavaScript VM, it has capabilities available through the \`universe\` variable. 

The schema of the universe/database defines the \`filesystem\`. 

__Filesystem__  

The filesystem is the way that everything is organized inside the universe/database. Every entry in the filesystem is called a \`node\`, and acts as BOTH a file and a directory. 

\`node\` schema: 

    {
      _id: String,
      nodeId: String,
      name: String, 
      type: String, 
      data: Anything,
      createdAt: Number (Date.now()),
      updatedAt: Number (Date.now()),
    }

\`_id\`: unique internal database id   
\`nodeId\`: points at another node in the internal database   
\`name\`: basically the filename, usually random for shared data, useful for replacing nodes in apps   
\`type\`: defines the schema of the data for the node. Format is \`"simple_name":"IPFS_hash"\`. (more info below)    
\`data\`: data that conforms to the schema defined in the type   

More info:  
Nodes are not allowed to be recursive (always have to have one \`nodeId\` in the chain be null).  
Deleting the parent node will delete all child nodes (no orphans allowed).  
Unique index for \`name\` and \`nodeId\` effectively means no duplicate names on same-level.  


__Types__  

Types defines the schema of the data for a node. A \`type\` is written in the format: 

\`"simple_name":"IPFS_hash"\`  such as \`folder:Qmsfljdsfjk\`

The IPFS hash will resolve to a node of type \`language\` that contains data in [jsSchema](https://github.com/molnarg/js-schema) format.   

\`\`\`json
{
  "data": {
    "name": "folder",
    "description": "",
    "schema": {
      "additionalProperties": false,
      "properties": {
        "name": {
          "type": "string"
        },
      },
      "type": "object"
    },
    "version": "1"
  },
  "type": "language"
}
\`\`\`







__Identity__  

Also referred to as _username, routing layer, configuration,_ or _trust_.   

See \`Identity and Routing\` section below. 


__Second__ 

A Second is a combination of the \`filesystem\` and \`platform\`; when a request comes in, a code \`node\` is loaded from the filesystem and executed in the JavaScript VM on the platform. 


__Shared Data__  

Sharing data is 90% of the fun! See [Shared Data](#shared-data) below. 





### Identity and Routing  

Identities (previous called usernames/namespaces/domains) are stored on the Stellar network. A username/namespace is the SHA256 hash (32 bytes) used as the seed for an ED25519 key. 

\`\`\`javascript
let StellarSdk = require('stellar-sdk');
let stellarServer = new StellarSdk.Server('https://horizon.stellar.org');

function identity(tmpUser){
  let username = tmpUser.normalize('NFKC').toLowerCase();
  let seed = crypto.createHash('sha256').update(username).digest();
  let pair = StellarSdk.Keypair.fromRawEd25519Seed(seed);
  stellarServer.loadAccount(pair.publicKey())
    .then(function(account){
      // identity exists
      console.log(account);
    })
    .catch(function(){
      // identity does not exist on chain 
    })
}
\`\`\`

For example, the username \`Tellar\` results in \`pair.secret() => "SBEFT2DDCK2FQ5CGJEBH2KJWLUOLN6FUMYDVQ7EGK2UGPHF33FD5RHE7"\`. 

> notice that \`TeLLar\` and \`tellar\` are the same, to limit ambiguity when transmitting usernames among individuals, usernames are normalized and common symbols are removed (see the code). 

Viewing the public address of \`tellar\` ([view](https://horizon.stellar.org/accounts/GCJ2UTBPMZJJN6YX4DIFL33Y2LJJEWZEVUEN4HHI5WNSKYEXANVXFJL3)) gives us some useful information: 


\`\`\`json
{
  "thresholds": {
    "low_threshold": 2,
    "med_threshold": 2,
    "high_threshold": 2
  },
  "signers": [
    {
      "public_key": "GBJ3R3AJL7T6JL34HSWPQJMBG73BNWXSAYVGVXULDXJG3WAJWB6PSALQ",
      "weight": 1,
      "key": "GBJ3R3AJL7T6JL34HSWPQJMBG73BNWXSAYVGVXULDXJG3WAJWB6PSALQ",
      "type": "ed25519_public_key"
    },
    {
      "public_key": "GCJ2UTBPMZJJN6YX4DIFL33Y2LJJEWZEVUEN4HHI5WNSKYEXANVXFJL3",
      "weight": 1,
      "key": "GCJ2UTBPMZJJN6YX4DIFL33Y2LJJEWZEVUEN4HHI5WNSKYEXANVXFJL3",
      "type": "ed25519_public_key"
    }
  ],
  data: {
    "|second": "base64-ipfs-hash-1",
    "nick|second" : "base64-ipfs-hash-2"
  }
}
\`\`\`

> The above should be read as: "the person with Second at identity \`tellar\` is available at \`base64-ipfs-hash-1\`, and sub-user \`nick@tellar\` is available at \`base64-ipfs-hash-2\`."


The thresholds and signers are set so that two keys are needed in order to make any changes; both the username/seed, and a private seed that you control. 

The \`data\` contains fields similar to DNS entries. In each data field, the \`key\` identifies the type of record (or the name+type), and the value is an IPFS hash of a Node with connection information. 

##### root identity 

Your root identity "owns" anything that starts with a pipe (\`|\`) character. 


##### namespaced identities 

You can have many data records on an identity. 

When I want to lookup the sub-user \`nick\` on the main identity \`acmecorp\` (aka \`nick@acmecorp\`) I would look up the key \`data['nick|second']\`


##### Types used in Identity Data (after \`|\` character)  

__second__ - points to an External Identity Node for connecting to a Second  
\`\`\`json
{
  "type": "external_identity:Qmf2389hf9sdsfkdjn9fh8w9eh923",
  "data": {
    "publicKey": "-----BEGIN PUBLIC KEY----- MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJMXKHxgvILqEaf/g6sZIEpylNdb2I0j wOgXOrXEesbrCdggin2o/X8YAd5+QVbCz9bwTOLexdIpp9tNkn+HlmUCAwEAAQ== -----END PUBLIC KEY-----"
  },
  "nodes": [
    {
      "type": "external_identity_connect_method:Qmsdkfjewiojfiwoefjdionfsoief",
      "data": {
        "method": "http",
        "connection": "https://teacher.second.ngrok.io/ai"
      }
    }
  ]
}
\`\`\`

Potential additional routing:   
__web__ - used by Second Browser for loading websites, replacing current domain names (adds \`x-second-forward\` header).  
__email__ - points to an alternate email address to use for communication   
__license-xyz__ - license for doing something  

Optional encryption:   
- routes can be encrypted with the username, or a pre-shared secret  



### Shared Data   

Syndicating or sharing data through Second is simple: when you "ask" another Second to store data for you, you also provide permissions for who else can access that data. You can easily see where your data is syndicated to, and revoke or add permissions on an ongoing basis. 

Shared data has a specific structure with additional information. \`node\` schema: 

    {
      "type": "shared_node:Qmdsfjl", 
      "data": {
        "_id": "idtestid:nick@test:542349823048923", 
        "type": "post:Qmsfljsdfff2398", 
        "name": "cb310245-3391-4d54-a7a0-69d4691c6c97", 
        "data": {...},
        "v": 1, 
        "signer": "idtest:nick@test",
        "sig": "kljf23oi230fj230f923="
      }
    }

\`type\`: "shared_node" is the default sharing type that will include permissions and syndication  
\`data\`: this is the data you actually want shared, or that was requested to be syndicated    
\`data._id\`: this is the path to the source ID; describes who created the data and where is it located   
\`data.type\`: type of data being shared   
\`data.name\`: usually random    
\`data.data\`: data of the data.type   
\`data.v\`: version of this source data, 1-index   
\`data.signer\`: author of the shared content, used for requesting the Public Key to verify the signature   
\`data.sig\`: base64 signature by data.signer of JSON.stringify({_id, name, type, data, v, signer})  


Nodes that are expected to be attached:  
- \`permissions:Qmdsfjl\` (who can access this shared data)  
- \`syndicatedTo:Qmsfj20j293\` (where I shared the data to)  




#### Examples of Common Shared Data Types/Schemas  


__Posts__  
Commonly used for microblogging or simple one-to-many messaging.   
Type: \`post:Qmsf89j23fs\`  
Example Data: 
\`\`\`json 
{
  "message": "test1",
  "in_reply_to": "id_of_post",
  "thread_ref":"uuid_of_thread",
  "author":"same_as_signer",
  "mentioned": ["identity_mentioned"],
  "createdAt":"utcTimestamp",
}
\`\`\`



__Relationships__ 
Sometimes you want relationships to be validated and available publicly, and sometimes they can be one-sided (following) and with or without permission required. This model is intended to handle multiple relationship models.    
Type: \`verified_relationship:Qmsklfdjfsf4\`  
Example Data: 
\`\`\`json 
{
  
}
\`\`\`



__Metadata Overlays__   
Add your own metadata to any type of addressable content (URLs, internal Ids, etc). Designed to be easily searchable through multiple lookup dimensions.   
Type: \`metadata_overlay:Qmdsfj9jsffs\`  
Example Data: 
\`\`\`json 
{
  "overlay_of": {
    "type" : "metadata_url:Qmdsfljsdfldsjf",
    "data" : {
      "search_dimensions": {
        "exact": "http://getasecond.com/" ,
        "exactAlt": ["http://getasecond.com/","http://www.getasecond.com/"],
        "domain": "getasecond.com",
        "domainAlt": ["getasecond.com", "www.getasecond.com"],
        "matchOnMisc": ["xyz"]
      }
    }
  },
  "overlay_data": {
    "type" : "string:Qmdsfjfljs",
    "data" : "comment about overlay"
  },
  "createdAt":"utcTimestamp"
}
\`\`\`



----

#### Need More Information? 

We have ambitious plans for Second and would love your input! We're writing documentation, improving scalability and security, and building sample apps. [Contact us](/about#contact)! 

&nbsp;
&nbsp;



`;

    return (
      <div className="container">
        <div className="content">
          <ReactMarkdown source={md1} />
        </div>
        <div className="columns">
          <div className="column is-3">
            <div className="content">
              <ReactMarkdown source={menu1} />
            </div>
          </div>
          <div className="column is-9">
            <div className="content">
              <ReactMarkdown source={md2} renderers={renderers} />
            </div>
          </div>
        </div>
      </div>
    )

    
  }
}

DevelopersComponent = withAuth(DevelopersComponent);

export default DevelopersComponent;
