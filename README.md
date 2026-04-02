# Split Bill Calculator — Stellar Testnet DApp

A Level 1 Stellar DApp that lets you connect your Freighter wallet, view your XLM balance, and split a bill by sending XLM payments to multiple recipients on the Stellar Testnet.

---

## Features

- Connect / disconnect Freighter wallet
- Display XLM balance from Stellar Testnet
- Enter a total bill amount and recipient Stellar addresses
- Automatically calculates equal split per person
- Sends a multi-operation XLM transaction via Freighter
- Shows transaction hash with a link to Stellar Expert explorer

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Freighter Wallet](https://freighter.app/) browser extension installed and set to **Testnet**

### Install and Run

```bash
# Clone the repo
git clone <your-repo-url>
cd steller

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Fund Your Testnet Wallet

Use Stellar Friendbot to get free testnet XLM:

```
https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY
```

---

## Screenshots

### Wallet Connected + Balance Displayed
> Freighter connected — address `GCQM3X...ECUQ` shown with **16100.00 XLM** balance in the navbar.

![Wallet Connected](screenshots/wallet-connected.png)

### Successful Testnet Transaction
> Transaction `61f567422ff27be2bf546919582bd3b7d018c446218dcfba0894af4257176efb` confirmed on Stellar Testnet — sent 5,000 XLM, status: Successful.

![Transaction Explorer](screenshots/transaction-explorer.png)

### Balance Updated After Transaction
> Balance updated to **11100.00 XLM** after the 5,000 XLM payment was sent.

![Balance Updated](screenshots/balance-updated.png)

### Freighter Transaction Confirmation
> Freighter popup asking the user to confirm the XLM payment — shows wallet, fee (0.00001 XLM), and transaction details before signing.

![Freighter Confirm](screenshots/freighter-confirm.png)

### Transaction Successful Result
> Success banner showing transaction hash `5118e6981a5c6c39ecbc2ac822157eb8c307f1ef7880cfc4cc92a48a30c277cc` with a direct link to Stellar Expert explorer.

![Transaction Success](screenshots/transaction-success.png)

---

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@stellar/freighter-api](https://www.npmjs.com/package/@stellar/freighter-api)
- [@stellar/stellar-sdk](https://www.npmjs.com/package/@stellar/stellar-sdk)
- [Stellar Testnet Horizon](https://horizon-testnet.stellar.org)

---

## Network

This app runs on **Stellar Testnet**. Make sure your Freighter wallet is switched to Testnet before connecting.
