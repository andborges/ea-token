import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'

import { ethers } from 'ethers';
import contract from './contracts/AndreToken.json';

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');

  const { ethereum } = window;

  const contractAddress = '0x528457BFc1882750e09a04169798C11DC9D61514';
  const contractABI = contract.abi;

  const createEthereumContract = () => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);
  
      return tokenContract;
  };

  const checkIfWalletIsConnected = async () => {
    try {
        if (!ethereum) {
          alert('Please install MetaMask.');
          return false;
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length) {
          setAccount(accounts[0]);

          return accounts[0];
        }
    } catch (err) {
        console.log(err);
    }

    return false;
  };

  const connectWallet = async () => {
    try {
        if (!ethereum) {
            alert('Please install MetaMask.');
            return;
        }

        const accounts = await ethereum.request({ method: 'eth_requestAccounts', });

        setAccount(accounts[0]);

        window.location.reload();
    } catch (err) {
        console.log(err);
    }
};

  useEffect(() => {
    const checkWallet = async () => {
        setAccount('');

        const account = await checkIfWalletIsConnected();

        if (account) {
            const contract = createEthereumContract();
            
            const balanceValue = await contract.balanceOf(account);
            setBalance(balanceValue.toNumber());
        }
    };

    checkWallet();

    if (ethereum) {
        ethereum.on('accountsChanged', async () => {
            await checkWallet();
        });

        ethereum.on('chainChanged', async () => {
            await checkWallet();
        });
    }
}, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {account && (
          <div>
            <p>Hello {account}</p>
            <p>
              Your balance is: {balance}
            </p>
          </div>
        )}

        {!account && (
          <button onClick={() => connectWallet()}>Connect to MetaMask</button>
        )}
      </header>
    </div>
  )
}

export default App
