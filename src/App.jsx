import { useState } from 'react'
import { isConnected, requestAccess, getAddress } from '@stellar/freighter-api'
import { Horizon } from '@stellar/stellar-sdk'

const server = new Horizon.Server('https://horizon-testnet.stellar.org')

export default function App() {
  const [wallet, setWallet] = useState(null)
  const [balances, setBalances] = useState([])
  const [error, setError] = useState('')

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
  }

  const shortAddress = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : null

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <span className="text-xl font-bold text-white tracking-tight">StellarWallet</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {error && (
              <span className="text-red-400 text-sm">{error}</span>
            )}

            {wallet ? (
              <div className="flex items-center gap-3">
                {/* Balances pill */}
                <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-1.5 text-sm">
                  {balances.length === 0 ? (
                    <span className="text-gray-400">No balance</span>
                  ) : (
                    balances.map((b, i) => (
                      <span key={i} className="text-green-400 font-mono">
                        {parseFloat(b.balance).toFixed(2)}{' '}
                        <span className="text-gray-300">
                          {b.asset_type === 'native' ? 'XLM' : b.asset_code}
                        </span>
                      </span>
                    ))
                  )}
                </div>

                {/* Address pill */}
                <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                  <span className="font-mono text-gray-200">{shortAddress}</span>
                </div>

                {/* Disconnect */}
                <button
                  onClick={disconnect}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
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

      {/* Page body */}
      <main className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Stellar DApp</h1>
        <p className="text-gray-400 text-lg">
          {wallet
            ? `Connected as ${shortAddress}`
            : 'Connect your Freighter wallet to get started'}
        </p>
      </main>
    </div>
  )
}
