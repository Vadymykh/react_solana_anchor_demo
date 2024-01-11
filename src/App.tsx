import React, { ReactNode } from 'react';
import './App.css';
import SimpleCounter from './components/SimpleCounter/SimpleCounter';
import { ClusterProvider } from './cluster/cluster-data-access';
import { SolanaProvider } from './solana/solana-provider';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';


function App() {
  return (
    <Context>
      <div className="App">
        <h1>
          Testing Solana Anchor smart contracts. <WalletMultiButton />
        </h1>
        <div className='programContainer'>
          <SimpleCounter />
        </div>
      </div>
    </Context>
  );
}

const Context: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ClusterProvider>
      <SolanaProvider>
        {children}
      </SolanaProvider>
    </ClusterProvider>
  );
};

export default App;
