import React from 'react';

export default class AddComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      address: '',
      transactions: [],
      returnedVal: ''
    };
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleGet = this.handleGet.bind(this);
  }

  handleValueChange(event) {
    this.setState({value: event.target.value.trim()});
  }
  handleAddressChange(event) {
    this.setState({address: event.target.value.trim()});
  }
  async handleAdd(event) {
    event.preventDefault();
    try {
      let response = await fetch(`/add?address=${this.state.address}&value=${this.state.value}`);
      let responseData = await response.json();
      console.log(responseData.resp);
      let tempArray = this.state.transactions;
      tempArray.push(responseData.resp.tx);
      this.setState({
        value: '',
        address: '',
        transactions: tempArray
      });
    } catch(e) {
      console.log(e);
    }
  }

  async handleGet(event) {
    event.preventDefault();
    try {
      let response = await fetch(`/get?address=${this.state.address}`);
      let responseData = await response.json();
      console.log(responseData);
      const val = responseData.resp.trim();
      this.setState({
        value: '',
        address: '',
        returnedVal: val
      });
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    const add = this.props.add;
    const transactions = this.state.transactions;
    return (
      <div>
        <input type="text" value={this.state.address} onChange={this.handleAddressChange} placeholder="Enter Wallet Address" />
        {add &&
          <input type="text" value={this.state.value} onChange={this.handleValueChange} placeholder="What do you want to store?" />
        }
        {add ? (
          <button className="center" onClick={this.handleAdd}> Store Value </button>
        ) : (
          <button className="center" onClick={this.handleGet}> Get Value </button>
        )}
        {add &&
          <div className="cards">
            <div className="card">
              <h5 className="card-header"> Transaction Reciept History </h5>
              <div className="card-body">
                {transactions.map((transaction, index) => {
                  return <p key={index}> { transaction } </p>;
                })}
              </div>
            </div>
          </div>
        }
        {!add &&
          <div className="cards">
            <div className="card">
              <h5 className="card-header"> String From Storage </h5>
              <div className="card-body">
                <p> {this.state.returnedVal} </p>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
