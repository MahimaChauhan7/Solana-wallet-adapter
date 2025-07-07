import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"

export default function SendToken() {
    const wallet = useWallet();
    const { connection } = useConnection();
    async function sendToken() {
        const to = document.getElementById("to").value;
        const amount = document.getElementById("amount").value;
        const Tran = new Transaction();
        Tran.add(SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(to),
            lamports: amount * LAMPORTS_PER_SOL,


        }));
        await wallet.sendTransaction(Tran, connection);
        alert("sent" + amount + "SOL to " + to);


    }
    return <div>
        <input id="to" type="text" placeholder="To"></input>
        <input id="amount" type="text" placeholder="Amount"></input>
        <button onClick={sendToken}>Send</button>
    </div>


}