require("dotenv").config();

const HDWalletProvider      = require('truffle-hdwallet-provider');
const Web3                  = require('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
    process.env.APP_TEST_MNEMONIC,
    process.env.APP_TEST_ENDPOINT
);

const web3 = new Web3(provider);

function timestamp(){
    return "["+new Date()+"]";
}

function log(){
    console.log(timestamp());
    console.log.apply(this, arguments);
    console.log("");
}

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    log('Interface: ', interface);
    log('Bytecode: ', bytecode);
    log('Accounts: ', accounts);
    log('Attempting to deploy from account', accounts[0]);

    try{
        const result = await new web3.eth
                        .Contract(JSON.parse(interface))
                        .deploy({
                            data : bytecode,
                            arguments : 'teste' 
                        })
                        .send({
                            gas: '1000000',
                            from: accounts[0]
                        });
                        
        log('Contract deployed to ', result.options.address);
    } 
    catch (error) {
        return log(error);
    }   
}

deploy();