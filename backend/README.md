# Message - Smart contract
The code repository is a backend part of our article series - [Introduction to Web3 application development](https://chainkraft.com/pl/kurs-web3-smart-kontrakt/)

## Installation
Prerequisites:
- Node.js >= 16.0

Command:
```console
npm install
```

## Deployment

### Local Hardhat network
```console
npm run deploy
```

### Goerli Ethereum test network
Set up following environment variables in `.env` file:
- `GOERLI_API_KEY` - [Alchemy](https://www.alchemy.com/) API Key
- `GOERLI_API_URL` - [Alchemy](https://www.alchemy.com/) API URL
- `PRIVATE_KEY` - Ethereum wallet private key

&nbsp; 
```console
npm run deploy -- --network goerli
```

## Usage

### Read smart contract state
Set contract address environment variable in `.env` file.

Command: `npm run read`

Example response:
```
Reading Message...
Message: Hello world
Price: 1.5
Author: 0xdC3532b2ce6335acF0A03FB5efEAA0a65bb4E14e
```

## Tests
```console
npm run test
```

## License
[Chainkraft.com](https://chainkraft.com) - Licensed [MIT](https://github.com/Chainkraft/message/blob/master/LICENSE).