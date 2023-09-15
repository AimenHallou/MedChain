
# Setup Phases

## 1. Start the Local Server

To start the local server, use the following command:

```bash
npm start
```

## 2. Start the Database

To start the SQLite3 database:

```bash
node ./server.js
```

## 3. Set up Development Truffle Configs

Update the `truffle-config.js` with the development configurations:

```javascript
development: {
    host: "127.0.0.1",     // Localhost
    port: 8545,            // Standard Ethereum port
    network_id: "*",       // Any network
},
```

## 4. Test, Compile, and Migrate Contracts

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

## 5. Environment Variables

Add the contract address to the environment variable.

## 6. Local Blockchain

Use local blockchain-only addresses.

## 7. MetaMask Connection

Add the localhost server to MetaMask and establish a connection.

## 8. Launch IPFS Desktop

Ensure you have IPFS Desktop launched and running.

## 9. IPFS API Settings

Make sure the IPFS API settings are set up as follows:

```json
"API": {
    "HTTPHeaders": {
        "Access-Control-Allow-Credentials": ["true"],
        "Access-Control-Allow-Methods": ["PUT", "POST", "GET"],
        "Access-Control-Allow-Origin": [
            "*",
            "https://webui.ipfs.io",
            "http://webui.ipfs.io.ipns.localhost:8080"
        ]
    }
}
```

