import { useState } from 'react'
import { isConnected, requestAccess, getAddress, signTransaction } from '@stellar/freighter-api'
import { Horizon, TransactionBuilder, Networks, Asset, Operation, BASE_FEE } from '@stellar/stellar-sdk'

const server = new Horizon.Server('https://horizon-testnet.stellar.org')

export default function App() {
  const [wallet, setWallet] = useState(null)
  const [balances, setBalances] = useState([])
  const [error, setError] = useState('')

  // Send form state
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [txStatus, setTxStatus] = useState({ state: 'idle', hash: '', message: '' })
  const [sending, setSending] = useState(false)

  const fetchBalances = async (address) => {
    try {
      const account = await server.loadAccount(address)
      setBalances(account.balances)
    } catch {
      setBalances([])
    }
  }

  const connect = async () => {
    setError('')
    try {
      const connected = await isConnected()
      if (!connected) {
        setError('Freighter not installed. Get it at freighter.app')
        return
      }
      await requestAccess()
      const { address } = await getAddress()
      setWallet(address)
      await fetchBalances(address)
    } catch (err) {
      setError(err.message || 'Connection failed')
    }
  }

  const disconnect = () => {
    setWallet(null)
    setBalances([])
    setTxStatus({ state: 'idle', hash: '', message: '' })
  }

  const sendPayment = async () => {
    if (!wallet || !recipient || !amount) return
    setSending(true)
    setTxStatus({ state: 'idle', hash: '', message: '' })

    try {
      const account = await server.loadAccount(wallet)
      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: recipient,
            asset: Asset.native(),
            amount: String(amount),
          })
        )
        .setTimeout(30)
        .build()

      const { signedTxXdr } = await signTransaction(tx.toXDR(), {
        networkPassphrase: Networks.TESTNET,
      })

      const result = await server.submitTransaction(
        TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET)
      )

      setTxStatus({ state: 'success', hash: result.hash, message: '' })
      await fetchBalances(wallet)
    } catch (err) {
      const msg =
        err?.response?.data?.extras?.result_codes?.operations?.[0] ||
        err?.response?.data?.extras?.result_codes?.transaction ||
        err.message ||
        'Transaction failed'
      setTxStatus({ state: 'error', hash: '', message: msg })
    } finally {
      setSending(false)
    }
  }

  const shortAddress = wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : null
  const xlmBalance = balances.find((b) => b.asset_type === 'native')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <span className="text-xl font-bold tracking-tight">Split Bill Calculator</span>
          </div>

          <div className="flex items-center gap-4">
            {error && <span className="text-red-400 text-sm">{error}</span>}

            {wallet ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-1.5 text-sm">
                  {xlmBalance ? (
                    <span className="text-green-400 font-mono">
                      {parseFloat(xlmBalance.balance).toFixed(2)}{' '}
                      <span className="text-gray-300">XLM</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">No balance</span>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                  <span className="font-mono text-gray-200">{shortAddress}</span>
                </div>
                <button
                  onClick={disconnect}
                  className="bg-red-600 hover:bg-red-700 cursor-pointer text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors cursor-pointer"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2 text-center">Split Bill Calculator</h1>
        <p className="text-gray-400 text-center mb-10">
          {wallet ? `Connected as ${shortAddress}` : 'Connect your Freighter wallet to get started'}
        </p>

        {/* Send form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Send XLM Payment</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Recipient Stellar Address</label>
            <input
              type="text"
              placeholder="G..."
              value={recipient}
              onChange={(e) => { setRecipient(e.target.value); setTxStatus({ state: 'idle', hash: '', message: '' }) }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount (XLM)</label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setTxStatus({ state: 'idle', hash: '', message: '' }) }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={sendPayment}
            disabled={!wallet || !recipient || !amount || sending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed cursor-pointer text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {sending ? 'Sending...' : !wallet ? 'Connect wallet to send' : 'Send Payment'}
          </button>

          {/* Feedback */}
          {txStatus.state === 'success' && (
            <div className="bg-green-900/40 border border-green-700 rounded-lg p-4 text-sm space-y-1">
              <p className="text-green-400 font-semibold">✅ Transaction Successful</p>
              <p className="text-gray-300 break-all">Hash: {txStatus.hash}</p>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txStatus.hash}`}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline"
              >
                View on Stellar Expert →
              </a>
            </div>
          )}

          {txStatus.state === 'error' && (
            <div className="bg-red-900/40 border border-red-700 rounded-lg p-4 text-sm">
              <p className="text-red-400 font-semibold">❌ Transaction Failed</p>
              <p className="text-gray-300 mt-1">{txStatus.message}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
