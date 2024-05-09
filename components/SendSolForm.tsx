import { FC, useState } from "react";
import styles from "../styles/Home.module.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

export const SendSolForm: FC = () => {
  const [txSign, settxSign] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const link = () => {
    return txSign
      ? `https://explorer.solana.com/tx/${txSign}?cluster=devnet`
      : "";
  };

  const sendSol = (event) => {
    event.preventDefault();

    const transaction = new web3.Transaction();
    const recipientPublicKey = new web3.PublicKey(event.target.recipient.value);

    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPublicKey,
      lamports: web3.LAMPORTS_PER_SOL * event.target.amount.value,
    });

    transaction.add(sendSolInstruction);

    sendTransaction(transaction, connection).then((sig) => {
      settxSign(sig);
      console.log(sig);
    });
  };

  return (
    <div>
      {publicKey ? (
        <form onSubmit={sendSol} className={styles.form}>
          <label htmlFor="amount">Amount (in SOL) to send:</label>
          <input
            id="amount"
            type="text"
            className={styles.formField}
            placeholder="e.g. 0.1"
            required
          />
          <br />
          <label htmlFor="recipient">Send SOL to:</label>
          <input
            id="recipient"
            type="text"
            className={styles.formField}
            placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
            required
          />
          <button type="submit" className={styles.formButton}>
            Send
          </button>
        </form>
      ) : (
        <span>Connect your wallet</span>
      )}
      {txSign && publicKey ? (
        <div>
          <p>View your tx on </p>
          <a href={link()}>Solana explorer</a>
        </div>
      ) : null}
    </div>
  );
};
