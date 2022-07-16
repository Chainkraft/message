# Message - Web3 demo application

This code repository is a part of our article series - Introduction to Web3 application development:
- [Building web3 applications - backend](https://chainkraft.com/pl/kurs-web3-smart-kontrakt/)
- [Building web3 applications - frontend](https://chainkraft.com/pl/kurs-web3-frontend-w-react/)

## Description

The message is a demo application providing smooth dive into Web3 application development.
The app consists of a smart contract written in Solidity and React user interface.

The message is a dApp where users can share an important message to others by sending it to the smart contract
along with the correct fee (ETH tokens). The fee must exceed a fee paid by the previous message owner.
When a message is no longer active the fee paid by the ex message owner can be withdrawn.

Applications:
- [Backend](backend/README.md)
- [Frontend](frontend/README.md)

Technology stack:
- Backend:
  - [Solidity](https://docs.soliditylang.org/en/v0.8.14/) - Ethereum smart contract programming language
  - [TypeScript](https://www.typescriptlang.org/) - Strongly typed programming language that builds on JavaScript
  - [Hardhat](https://hardhat.org/) - Ethereum development environment
  - [Ethers.js](https://docs.ethers.io/v5/) - Library interacting with Ethereum blockchain
  - [Mocha](https://mochajs.org/) - JavaScript test framework
  - [Chai](https://www.chaijs.com/) - Test assertion library
  - [Waffle](https://getwaffle.io/) - Smart contract testing library
- Frontend:
  - [React](https://reactjs.org/) - JavaScript library for building user interfaces
  - [TypeScript](https://www.typescriptlang.org/) - Strongly typed programming language that builds on JavaScript
  - [Ethers.js](https://docs.ethers.io/v5/) - Library interacting with Ethereum blockchain
  - [MUI](https://mui.com/) - React user interface componenty library

## License

[Chainkraft.com](https://chainkraft.com) - Licensed [MIT](https://github.com/Chainkraft/message/blob/master/LICENSE).