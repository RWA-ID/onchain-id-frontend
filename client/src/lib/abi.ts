export const ABI = [
  {
    "inputs": [
      {"internalType": "address","name": "_wrapper","type": "address"},
      {"internalType": "address","name": "_resolver","type": "address"},
      {"internalType": "address","name": "_stableToken","type": "address"},
      {"internalType": "address payable","name": "_primaryPayout","type": "address"},
      {"internalType": "address payable","name": "_secondaryPayout","type": "address"},
      {"internalType": "address","name": "_owner","type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {"inputs":[],"name":"ArrayLengthMismatch","type":"error"},
  {"inputs":[],"name":"InvalidOwner","type":"error"},
  {
    "inputs":[
      {"internalType":"uint256","name":"required","type":"uint256"},
      {"internalType":"uint256","name":"sent","type":"uint256"}
    ],
    "name":"InsufficientPayment",
    "type":"error"
  },
  {"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"NameTaken","type":"error"},
  {"inputs":[],"name":"NoLabels","type":"error"},
  {"inputs":[],"name":"NotOwner","type":"error"},
  {"inputs":[],"name":"PayoutFailed","type":"error"},
  {"inputs":[],"name":"RefundFailed","type":"error"},
  {"inputs":[],"name":"TokenPayoutFailed","type":"error"},

  {
    "anonymous": false,
    "inputs": [
      {"indexed":true,"internalType":"address","name":"owner","type":"address"},
      {"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"},
      {"indexed":false,"internalType":"uint8","name":"zone","type":"uint8"},
      {"indexed":false,"internalType":"uint256","name":"totalPaidEth","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"totalPaidToken","type":"uint256"}
    ],
    "name": "Minted",
    "type": "event"
  },

  {
    "anonymous": false,
    "inputs": [
      {"indexed":true,"internalType":"uint8","name":"zone","type":"uint8"},
      {"indexed":false,"internalType":"uint256","name":"t1","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"t2","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"t3","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"t4","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"t5","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}
    ],
    "name":"PricingUpdatedEth",
    "type":"event"
  },

  {
    "anonymous": false,
    "inputs": [
      {"indexed":true,"internalType":"uint8","name":"zone","type":"uint8"},
      {"indexed":false,"internalType":"uint256","name":"t1","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"t2","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"t3","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"t4","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"t5","type":"uint256"},
      {"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}
    ],
    "name":"PricingUpdatedUSDC",
    "type":"event"
  },

  {
    "anonymous":false,
    "inputs":[
      {"indexed":false,"internalType":"address","name":"primary","type":"address"},
      {"indexed":false,"internalType":"address","name":"secondary","type":"address"},
      {"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}
    ],
    "name":"PayoutsUpdated",
    "type":"event"
  },

  {
    "inputs":[
      {"internalType":"uint8","name":"zone","type":"uint8"},
      {"internalType":"uint256","name":"quantity","type":"uint256"}
    ],
    "name":"quoteEth",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  },

  {
    "inputs":[
      {"internalType":"uint8","name":"zone","type":"uint8"},
      {"internalType":"uint256","name":"quantity","type":"uint256"}
    ],
    "name":"quoteUSDC",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  },

  {
    "inputs":[
      {"internalType":"uint8","name":"zone","type":"uint8"}
    ],
    "name":"getEthPrices",
    "outputs":[
      {"internalType":"uint256","name":"t1","type":"uint256"},
      {"internalType":"uint256","name":"t2","type":"uint256"},
      {"internalType":"uint256","name":"t3","type":"uint256"},
      {"internalType":"uint256","name":"t4","type":"uint256"},
      {"internalType":"uint256","name":"t5","type":"uint256"}
    ],
    "stateMutability":"view",
    "type":"function"
  },

  {
    "inputs":[{"internalType":"uint8","name":"zone","type":"uint8"}],
    "name":"getUSDCPrices",
    "outputs":[
      {"internalType":"uint256","name":"t1","type":"uint256"},
      {"internalType":"uint256","name":"t2","type":"uint256"},
      {"internalType":"uint256","name":"t3","type":"uint256"},
      {"internalType":"uint256","name":"t4","type":"uint256"},
      {"internalType":"uint256","name":"t5","type":"uint256"}
    ],
    "stateMutability":"view",
    "type":"function"
  },

  {
    "inputs":[
      {"internalType":"uint8","name":"zone","type":"uint8"},
      {"internalType":"uint256","name":"_t1","type":"uint256"},
      {"internalType":"uint256","name":"_t2","type":"uint256"},
      {"internalType":"uint256","name":"_t3","type":"uint256"},
      {"internalType":"uint256","name":"_t4","type":"uint256"},
      {"internalType":"uint256","name":"_t5","type":"uint256"}
    ],
    "name":"setPricesEth",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },

  {
    "inputs":[
      {"internalType":"uint8","name":"zone","type":"uint8"},
      {"internalType":"uint256","name":"_t1","type":"uint256"},
      {"internalType":"uint256","name":"_t2","type":"uint256"},
      {"internalType":"uint256","name":"_t3","type":"uint256"},
      {"internalType":"uint256","name":"_t4","type":"uint256"},
      {"internalType":"uint256","name":"_t5","type":"uint256"}
    ],
    "name":"setPricesUSDC",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },

  {
    "inputs":[
      {"internalType":"address payable","name":"_primary","type":"address"},
      {"internalType":"address payable","name":"_secondary","type":"address"}
    ],
    "name":"setPayouts",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },

  {
    "inputs":[
      {"internalType":"string[]","name":"labels","type":"string[]"},
      {"internalType":"string[]","name":"makes","type":"string[]"},
      {"internalType":"string[]","name":"models","type":"string[]"},
      {"internalType":"string[]","name":"serials","type":"string[]"},
      {"internalType":"string[]","name":"websites","type":"string[]"},
      {"internalType":"string[]","name":"socials","type":"string[]"},
      {"internalType":"address","name":"finalOwner","type":"address"},
      {"internalType":"uint8","name":"zone","type":"uint8"}
    ],
    "name":"bulkMintEth",
    "outputs":[],
    "stateMutability":"payable",
    "type":"function"
  },

  {
    "inputs":[
      {"internalType":"string[]","name":"labels","type":"string[]"},
      {"internalType":"string[]","name":"makes","type":"string[]"},
      {"internalType":"string[]","name":"models","type":"string[]"},
      {"internalType":"string[]","name":"serials","type":"string[]"},
      {"internalType":"string[]","name":"websites","type":"string[]"},
      {"internalType":"string[]","name":"socials","type":"string[]"},
      {"internalType":"address","name":"finalOwner","type":"address"},
      {"internalType":"uint8","name":"zone","type":"uint8"}
    ],
    "name":"bulkMintUSDC",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },

  {
    "inputs":[],
    "name":"owner",
    "outputs":[{"internalType":"address","name":"","type":"address"}],
    "stateMutability":"view",
    "type":"function"
  },

  {
    "inputs":[],
    "name":"primaryPayout",
    "outputs":[{"internalType":"address payable","name":"","type":"address"}],
    "stateMutability":"view",
    "type":"function"
  },

  {
    "inputs":[],
    "name":"secondaryPayout",
    "outputs":[{"internalType":"address payable","name":"","type":"address"}],
    "stateMutability":"view",
    "type":"function"
  }
] as const;
