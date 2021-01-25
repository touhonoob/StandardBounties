const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require('fs')

// First read in the secrets.json to get our mnemonic
let secrets
let mnemonic
if (fs.existsSync('secrets.json')) {
    secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'))
    mnemonic = secrets.mnemonic
} else {
    console.log('No secrets.json found. If you are trying to publish EPM ' +
        'this will fail. Otherwise, you can ignore this message!')
    mnemonic = ''
}

module.exports = {
    networks: {
        ganache: {
            provider: () => new HDWalletProvider({
                'mnemonic': {
                    'phrase': mnemonic
                },
                'providerOrUrl': 'http://localhost:8545',
                derivationPath: "m/44'/60'/0'/0/"
            }),
            host: "localhost",
            port: 8545,
            network_id: "*",
        }
    },
    mocha: {
        enableTimeouts: true,
        before_timeout: 5000 // Here is 2min but can be whatever timeout is suitable for you.
    }

    // plugins: ["solidity-coverage"]
}
