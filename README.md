# Barangay ID on Stellar

A secure, blockchain-based digital identity system for Philippine Barangays.

## Problem
Barangay IDs are essential but often paper-based, making them easy to forge and difficult to verify.

## Solution
This project uses **Stellar** and **Soroban Smart Contracts** to create a verifiable registry. 
- **Barangay Captains** sign transactions to issue digital IDs.
- **Residents** receive a tamper-proof digital record.
- **Verifiers** (banks, agencies, etc.) can instantly check ID status on the blockchain.

## Project Structure
- `contracts/`: Soroban smart contract (Rust).
- `frontend/`: React + TypeScript application.
- `frontend/src/contracts/`: Auto-generated TypeScript bindings for the contract.

## Tech Stack
- **Blockchain:** Stellar (Testnet)
- **Smart Contracts:** Soroban (Rust SDK)
- **Frontend:** React, TypeScript, Vite
- **Wallet:** Freighter Wallet

## Getting Started

### 1. Smart Contract
The contract is already deployed on Testnet at:
`CBBH4KRHDZIPALRE4EVNDDCUMQSY2R3I2CJNCMUJ4CBBTWOQWVCJ36AH`

### 2. Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### 3. Usage
1. Install the [Freighter Wallet](https://www.freighter.app/) extension.
2. Switch Freighter to **Testnet**.
3. To issue IDs, you must be connected as the **Barangay Captain** (Admin).
4. Enter the resident's Stellar address and details to issue a digital ID.
5. Anyone can use the "Verify ID" section to check a resident's status by their address.

## Verification Logic
The `ResidentID` struct contains `is_active`. If a Captain revokes an ID, `is_active` is set to `false` on-chain, immediately invalidating the digital credential everywhere.
