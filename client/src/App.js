import React, { Component } from "react";
import PriceConsumerContract from "./contracts/PriceConsumer.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    prices: [],
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PriceConsumerContract.networks[networkId];
      const instance = new web3.eth.Contract(
        PriceConsumerContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      const prices = await instance.methods.getLatestPrice().call();

      this.setState({
        prices,
      });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    const { prices } = this.state;
    if (!prices.length) {
      return <div>Loading data...</div>;
    }
    return (
      <div className="App">
        <h1>Coin prices from chain link network</h1>
        <table style={{ border: "1px solid lightgray", marginTop: 75 }}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Coin</th>
              <th>Price</th>
            </tr>
            {prices.map((price, index) => (
              <tr key={price[0]}>
                <td>{index + 1}</td>
                <td>{price[0]}</td>
                <td>{price[1]}</td>
              </tr>
            ))}
          </thead>
        </table>
      </div>
    );
  }
}

export default App;
