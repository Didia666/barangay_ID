import React, { useState, useEffect } from 'react';
import './App.css';
import { isConnected, getAddress, signTransaction } from '@stellar/freighter-api';
import * as BarangayID from './contracts/barangay_id';

function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [residentAddress, setResidentAddress] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [barangay, setBarangay] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [residentID, setResidentID] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'issue' | 'verify' | 'admin'>('verify');

  const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015';
  const CONTRACT_ID = 'CAKJGEIPNTLN62P2BYDKLD7SOF6JFGB6PB3GNMALHBYN75MB7E2XEYUU'; 
  
  const client = new BarangayID.Client({
    networkPassphrase: TESTNET_PASSPHRASE,
    contractId: CONTRACT_ID,
    rpcUrl: 'https://soroban-testnet.stellar.org',
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      if (await isConnected()) {
        const addrObj: any = await getAddress();
        if (addrObj && addrObj.address) setAddress(addrObj.address);
      }
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  const connectWallet = async () => {
    try {
      if (!(await isConnected())) {
        alert("Freighter not detected.");
        return;
      }
      const addrObj: any = await getAddress();
      if (addrObj && addrObj.address) setAddress(addrObj.address);
    } catch (err) {
      console.error('Wallet error:', err);
    }
  };

  const initializeContract = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const tx = await client.initialize(
        { captain: address }, 
        { publicKey: address, networkPassphrase: TESTNET_PASSPHRASE }
      );
      
      const result = await tx.signAndSend({
        signTransaction: async (txXdr) => {
          const signed: any = await signTransaction(txXdr, { 
            network: 'TESTNET',
            networkPassphrase: TESTNET_PASSPHRASE 
          });
          const signedTxXdr = signed.signedTxXdr || signed.signedTransaction || (typeof signed === 'string' ? signed : null);
          if (!signedTxXdr) throw new Error("Freighter did not return a signed transaction.");
          return { signedTxXdr };
        }
      });
      alert("✅ You are now the official Barangay Captain!");
      setActiveTab('issue');
    } catch (err: any) {
      console.error(err);
      alert(`Initialization Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const issueID = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setLoading(true);
    try {
      const tx = await client.issue_id(
        { captain: address, resident: residentAddress, name, birth_date: birthDate, barangay },
        { publicKey: address, networkPassphrase: TESTNET_PASSPHRASE }
      );

      const result = await tx.signAndSend({
        signTransaction: async (txXdr) => {
          const signed: any = await signTransaction(txXdr, { 
            network: 'TESTNET',
            networkPassphrase: TESTNET_PASSPHRASE 
          });
          const signedTxXdr = signed.signedTxXdr || signed.signedTransaction || (typeof signed === 'string' ? signed : null);
          if (!signedTxXdr) throw new Error("Freighter did not return a signed transaction.");
          return { signedTxXdr };
        }
      });

      alert('✅ Digital ID successfully issued!');
      setResidentAddress('');
      setName('');
    } catch (err: any) {
      console.error(err);
      alert(`❌ Issue ID Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyID = async () => {
    if (!searchAddress) return;
    setLoading(true);
    try {
      const result = await client.get_id({ resident: searchAddress });
      if (result.result) {
        setResidentID(result.result);
      } else {
        setResidentID(null);
        alert('No ID found for this address.');
      }
    } catch (err) {
      console.error(err);
      alert('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="brand">
          <div className="seal-mini">RP</div>
          <h1>Barangay ID <span>on Stellar</span></h1>
        </div>
        {address && (
          <div className="wallet-tag">
            {address.substring(0, 4)}...{address.substring(52)}
          </div>
        )}
      </nav>

      {!address ? (
        <div className="card text-center">
          <h2>Digital Barangay Registry</h2>
          <button className="primary mt-4" onClick={connectWallet}>Connect Wallet</button>
        </div>
      ) : (
        <>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', background: '#e2e8f0', padding: '0.25rem', borderRadius: '8px' }}>
              <button onClick={() => setActiveTab('verify')} style={{ background: activeTab === 'verify' ? '#fcd116' : 'transparent', width: '120px' }}>Verify</button>
              <button onClick={() => setActiveTab('issue')} style={{ background: activeTab === 'issue' ? '#fcd116' : 'transparent', width: '120px' }}>Issue ID</button>
              <button onClick={() => setActiveTab('admin')} style={{ background: activeTab === 'admin' ? '#fcd116' : 'transparent', width: '120px' }}>Setup</button>
            </div>
          </div>

          <div className="grid">
            {activeTab === 'admin' && (
              <div className="card">
                <div className="card-title">⚙️ Initial Setup</div>
                <p>Register as <strong>Official Barangay Captain</strong>.</p>
                <button className="secondary" onClick={initializeContract} disabled={loading}>
                  {loading ? 'Processing...' : 'Register as Captain'}
                </button>
              </div>
            )}

            {activeTab === 'issue' && (
              <div className="card">
                <div className="card-title">📝 Issue ID</div>
                <form onSubmit={issueID}>
                  <div className="form-group"><label>Resident Address</label><input value={residentAddress} onChange={e => setResidentAddress(e.target.value)} placeholder="G..." required /></div>
                  <div className="form-group"><label>Full Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Juan Dela Cruz" required /></div>
                  <div className="form-group"><label>Birth Date</label><input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} required /></div>
                  <div className="form-group"><label>Barangay</label><input value={barangay} onChange={e => setBarangay(e.target.value)} placeholder="Brgy. San Jose" required /></div>
                  <button type="submit" className="primary" disabled={loading}>Issue ID</button>
                </form>
              </div>
            )}

            {activeTab === 'verify' && (
              <div className="card">
                <div className="card-title">🔍 Verify ID</div>
                <div className="form-group"><label>Resident Address</label><input value={searchAddress} onChange={e => setSearchAddress(e.target.value)} placeholder="G..." /></div>
                <button className="secondary" onClick={verifyID} disabled={loading}>Verify Status</button>
              </div>
            )}

            <div className="preview-pane">
              {residentID ? (
                <div className="id-credential">
                  <div className="id-content">
                    <div className="id-top">
                      <h4>Republic of the Philippines</h4>
                      <h3>BARANGAY IDENTIFICATION</h3>
                      <p>{residentID.barangay}</p>
                    </div>
                    <div className="id-body">
                      <div className="id-photo-placeholder">👤</div>
                      <div className="id-info">
                        <p><span className="id-label">Full Name</span><span className="id-value">{residentID.name}</span></p>
                        <p><span className="id-label">Birth Date</span><span className="id-value">{residentID.birth_date}</span></p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`status-badge ${residentID.is_active ? 'status-valid' : 'status-invalid'}`}>
                        {residentID.is_active ? '✓ VERIFIED ACTIVE' : '⚠ REVOKED'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (<div className="empty-state">Search an address to preview the ID</div>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
