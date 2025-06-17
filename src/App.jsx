import { useState, useMemo } from 'react'
import './App.css'
import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
    WalletConnectButton
} from '@solana/wallet-adapter-react-ui';
import { Airdrop } from './Airdrop';
import { Token } from './token';
import { showbal} from './showbal' ; 


// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

export default function App() {
  const [publicKey, setPublicKey] = useState(null);

  // Configure the wallet adapters
  const wallets = useMemo(
    () => [
      new UnsafeBurnerWalletAdapter()
    ],
    []
  );

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/ElYSSWSOHA3DtN3FPqlDG"}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', color: '#888'}}>
              <h1>Solana Wallet-Adaptor</h1>
              <div style={{ display: 'flex', gap: '10px' }}>
                <WalletMultiButton />
                <WalletDisconnectButton />
              </div>
              <Airdrop onPublicKeyChange={setPublicKey} />
              {publicKey && <Token publicKey={publicKey} />}
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}



