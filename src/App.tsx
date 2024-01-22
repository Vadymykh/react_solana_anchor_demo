import React, { ReactNode } from 'react';
import { AppStyled } from './App.styled';
import { ClusterProvider } from './cluster/cluster-data-access';
import { SolanaProvider } from './solana/solana-provider';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import SimpleCounter from './components/programs/SimpleCounter/SimpleCounter';
import TokenSPL from './components/programs/TokenSPL/TokenSPL';
import SendSol from './components/programs/SendSol/SendSol';
import CounterSetter from './components/programs/CouterSetter/CounterSetter';
import Farm from './components/programs/Farm/Farm';


function App() {
  return (
    <Context>
      <AppStyled>
        <h1>
          Testing Solana Anchor smart contracts. <WalletMultiButton />
        </h1>
        <div className='programContainer'>
          {/* <SendSol />
          <SimpleCounter />
          <CounterSetter />
          <TokenSPL /> */}
          <Farm />
        </div>
      </AppStyled>
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
