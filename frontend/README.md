# Message - User interface
The code repository is a frontend part of our article series - [Introduction to Web3 application development](https://chainkraft.com/pl/kurs-web3-frontend-w-react/)

## Installation
Prerequisites:
- Node.js >= 14.0

Command:
```console
npm install
```

Set up following environment variables in `.env` file:
- `REACT_APP_NETWORK` - Ethereum network name (e.g. goerli)
- `REACT_APP_API_KEY` - [Alchemy](https://www.alchemy.com/) API Key
- `REACT_APP_API_URL` - [Alchemy](https://www.alchemy.com/) API URL
- `REACT_APP_PRIVATE_KEY` - Ethereum wallet private key
- `REACT_APP_CONTRACT_ADDRESS` - Smart contract address

## Development
```console
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment
```console
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## License
[Chainkraft.com](https://chainkraft.com) - Licensed [MIT](https://github.com/Chainkraft/message/blob/master/LICENSE).