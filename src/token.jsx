import React, { useEffect, useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export function Token() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const [tokenBalances, setTokenBalances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTokens = useCallback(async () => {
        if (!publicKey) return;
        setLoading(true);
        setError(null);

        try {
            const accounts = await connection.getParsedTokenAccountsByOwner(
                publicKey,
                { programId: TOKEN_PROGRAM_ID } // Using imported constant
            );

            const results = accounts.value
                .map(({ pubkey, account }) => {
                    const info = account.data.parsed.info;
                    const amount = info.tokenAmount.uiAmount;
                    const decimals = info.tokenAmount.decimals;
                    const mint = info.mint;

                    if (amount > 0) {
                        return {
                            address: pubkey.toString(),
                            mint,
                            amount: info.tokenAmount.amount,
                            uiAmount: amount,
                            decimals,
                        };
                    }

                    return null;
                })
                .filter(Boolean);

            console.log("Fetched token balances:", results);
            setTokenBalances(results);
        } catch (err) {
            console.error("Token fetch error:", err);
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [connection, publicKey]);

    useEffect(() => {
        fetchTokens();
        const interval = setInterval(fetchTokens, 10000000000);
        return () => clearInterval(interval);
    }, [fetchTokens]);

    if (!publicKey) return <div>Please connect your wallet.</div>;
    if (loading) return <div>Loading token balances...</div>;

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>Token Balances</h3>
                <button onClick={fetchTokens} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {tokenBalances.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Mint</th>
                            <th style={{ textAlign: 'right', padding: '8px' }}>Amount</th>
                            <th style={{ textAlign: 'right', padding: '8px' }}>UI Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokenBalances.map((token, index) => (
                            <tr key={index}>
                                <td style={{ padding: '8px' }}>{token.mint}</td>
                                <td style={{ textAlign: 'right', padding: '8px' }}>{token.amount}</td>
                                <td style={{ textAlign: 'right', padding: '8px' }}>{token.uiAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No tokens found on this wallet (devnet).</p>
            )}
        </div>
    );
}

