import React from 'react';
import EthComponent from '../eth-component/eth-component.jsx';

export const LayoutPage = () => (
  <div>
    <div>
      <div className="row">
        <div className="col-12">
          <h1 className="center"> Ethereum Dapp Primer </h1>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="center"> <EthComponent add={true} /> </div>
        </div>
        <div className="col-6">
          <div className="center"> <EthComponent add={false} /> </div>
        </div>
      </div>
    </div>
  </div>
)
