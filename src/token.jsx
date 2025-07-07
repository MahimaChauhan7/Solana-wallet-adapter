import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function Token() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    async function getBalance() {
      if (!publicKey) return;
      try {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    }

    getBalance();
  }, [publicKey, connection]);

  return (
    <div>
      Balance: <span>{balance !== null ? balance.toFixed(4) : "Loading..."}</span> SOL
    </div>
  );
}





