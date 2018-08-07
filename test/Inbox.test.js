// npm run test_contracts

const assert    = require('assert');
const ganache   = require('ganache-cli');
const Web3      = require('web3');
const provider  = ganache.provider();
const web3      = new Web3(provider);
const {interface, bytecode} = require('../compile');

let accounts;
let contrato;

const PARM_INIT = "whatsss upppppp!";
const PARM_NEW  = "Mensagem alterada!";

function timestamp(){
    return "["+new Date()+"]";
}

function log(){
    console.log(timestamp());
    console.log.apply(this, arguments);
    console.log("");
}

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    contrato = await new web3.eth
            .Contract(
                JSON.parse(interface)
            )
            .deploy({
                data: bytecode,       
                arguments: [PARM_INIT]
            })
            .send({
                from: accounts[0],    
                gas: '1000000'        
            });
    contrato.setProvider(provider);
});

describe('', () => {

    it('TESTE: CRIAÇÃO DE CONTRATO', () => {
        assert.ok(contrato.options.address);
    });

    it('TESTE: GET "message"', async () => {
        const message = await contrato.methods
                                        .message()
                                        .call();

        assert.equal(message, PARM_INIT);
    });

    it('TESTE: FUNCAO "setMessage()"', async () => {
        await contrato.methods
                        .setMessage(PARM_NEW)
                        .send({
                            from: accounts[0]
                        });
        
        const message = await contrato.methods
                                        .message()
                                        .call();
        
        assert.equal(message, PARM_NEW);
    });
    
});