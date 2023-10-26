
# MedChain: A Blockchain-powered Data-Sharing Platform for Healthcare Professionals

## Description

MedChain revolutionizes healthcare data sharing by leveraging the robustness of Ethereum, the decentralized storage capabilities of IPFS, and the standardized healthcare data structure of FHIR. Designed with the modern healthcare professional in mind, it ensures secure, transparent, and efficient transfers of patient information between general practitioners and specialists. 

## Key Features

- **Blockchain-backed Security**: Built on the Ethereum blockchain, MedChain offers unparalleled data security and integrity.
- **Decentralized Storage with IPFS**: Instead of relying on centralized storage solutions, MedChain utilizes IPFS for decentralized and tamper-proof data storage.
- **Standardized Data with FHIR**: By adhering to the FHIR standard, MedChain ensures that the medical data is consistent, making the data exchange process smoother and more reliable.
- **User-Friendly Interface**: With a design focused on the needs of healthcare professionals, our platform offers a seamless experience for data access and transfer.

## Tech Stack

MedChain is powered by a robust collection of modern technologies:
- **Frontend**: React, TypeScript, and TailwindCSS offer a responsive and user-friendly interface.
- **Backend**: Express.js provides a powerful server environment, coupled with SQLite3 for efficient data storage.
- **Blockchain**: Solidity (for Ethereum smart contracts) and Truffle for contract testing and deployment.
- **Others**: Node.js serves as the runtime environment, ensuring smooth integration of all the components.

## Benefits

- **End-to-End Security**: From the Ethereum blockchain's security features to IPFS's decentralized nature, your data's security is our top priority.
- **Efficient Collaboration**: MedChain bridges the gap between different healthcare professionals, ensuring that they have immediate access to the data they need.
- **Transparent Operations**: With every data transfer being recorded on the blockchain, users can verify data integrity and origin at any time.

## Target Audience

MedChain is designed for:
- General Practitioners
- Medical Specialists
- Healthcare Institutions seeking a cutting-edge, secure data-sharing solution


# Setup Phases

## 1. Install dependencies

```bash
npm i
```

## 2. Start the Local Server

To start the local server, use the following command:

```bash
npm start
```

## 3. Start the Database

To start the SQLite3 database:

```bash
node ./server.js
```

## 4. Set up Development Truffle Configs

Update the `truffle-config.js` with the development configurations:

```javascript
development: {
    host: "127.0.0.1",     // Localhost
    port: 8545,            // Standard Ethereum port
    network_id: "*",       // Any network
},
```
## 5. Launch the local blockchain

To create a local test blockchain:

```bash
ganache-cli
```

## 6. Test, Compile, and Migrate Contracts

To run the contract test:

```bash
truffle test
```

To compile the `PatientRegistry.sol` contract:

```bash
truffle compile
```

To push the contract to the blockchain set:

```bash
truffle migrate
```

## 7. Environment Variables

Add the contract address to the environment variable.

## 8. Local Blockchain

Use local blockchain-only addresses.

## 9. MetaMask Connection

Add the localhost server to MetaMask and establish a connection.

## 10. Launch IPFS Desktop

Ensure you have IPFS Desktop launched and running.

## 11. IPFS API Settings

Make sure the IPFS API settings are set up as follows:

```json
"API": {
    "HTTPHeaders": {
        "Access-Control-Allow-Credentials": ["true"],
        "Access-Control-Allow-Methods": ["PUT", "POST", "GET"],
        "Access-Control-Allow-Origin": [
            "http://localhost:3000",
            "https://webui.ipfs.io",
            "http://webui.ipfs.io.ipns.localhost:8080"
        ]
    }
}
```

