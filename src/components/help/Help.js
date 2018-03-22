import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'

import autobind from 'autobind-decorator'
import $ from 'jquery'

import {withAuth} from '../common/Auth'


class HelpComponent extends Component {
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

              <div className="content">

                <h3>
                  Contact
                </h3>

                <p>
                  ...
                  {/*
                  <a href="http://reddit.com/r/secondai" className="button is-info">reddit</a>

                  &nbsp;

                  <a href="http://discordapp.com/" className="button is-info">discord (coming soon)</a>
                  */}

                </p>




                <br />

                <h3>
                  About Second
                </h3>
                <p>
                  Initial Release March 2018. Copyright Nicholas Reed. 
                </p>

                <br />

              </div>



            </div>

            <div className="column is-6">


              <p>
                Public Key used for Signing Blocks 
              </p>
<pre><code>
{`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBNnFC2kVynYCdh441NxFqB2TV
KTYZPPZgMfSdqrdCOAFq3g0W2TmvSzS2qY43DV80tpzzENi4bnOkOUFVl9Xi553C
++hdnqg+pAGbT9P3Cr7r6CN1ZNBPx8JXnyWNfxzNhi+rCma1EpZaoRHbVxTX170V
W2qyoyZI8qG9rsqB7QIDAQAB
-----END PUBLIC KEY-----`}
</code></pre>


              <p>
                Public Key for OrbitDB log
              </p>
<pre><code>
{`044a37673cbadb5ed8b06ba16cc4df6e936d64f7fe30df0a479f2288ed7388d346bbaf80dc516ea41e1a7d098e9883b132085d233eb93f25a37194d0ed3caf5a2d`}
</code></pre>


            </div>
          </div>

        </div>

      </div>
    )
  }
}

HelpComponent = withAuth(HelpComponent);

export default HelpComponent;
