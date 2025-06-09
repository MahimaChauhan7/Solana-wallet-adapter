import React, { useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function Airdrop({ onPublicKeyChange }) {
    const wallet = useWallet();
    const { connection } = useConnection();

    useEffect(() => {
        if (wallet.publicKey) {
            onPublicKeyChange(wallet.publicKey);
        }
    }, [wallet.publicKey, onPublicKeyChange]);

    async function reqSola() {
        if (!wallet.publicKey) {
            alert("Connect your wallet first.");
            return;
        }
        try {
            const amount = document.getElementById("publickey").value;
            const lamports = amount * LAMPORTS_PER_SOL;
            await connection.requestAirdrop(wallet.publicKey, lamports);
            alert("Airdrop successful!");
        } catch (err) {
            alert("Airdrop failed: " + err.message);
        }
    }

    return (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
                id="publickey" 
                type='number' 
                placeholder='Amount in SOL' 
                min="0" 
                step="0.1"
                style={{ padding: '8px', borderRadius: '4px' }}
            />
            <button 
                onClick={reqSola}
                style={{ padding: '8px 16px', borderRadius: '4px' }}
            >
                Request Airdrop
            </button>
        </div>
    );
}


