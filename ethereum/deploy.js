const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    'bleak climb spoon bitter stadium expose enter quit student reason cute noise',
    'https://rinkeby.infura.io/V4TdOxWqFxt4ebK2hBam'
);

const web3 = new Web3(provider);

const deploy = async() => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempt to deploy from account', accounts[0]);
    
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({gas: '1000000', from: accounts[0]});
    console.log('Contract was deployed to ', result.options.address);

};
deploy();
// контракт развернут по адресу 0x838F75C3A36979a14120FBd2D60791F5E786417C
// с новыми функциями по адресу 0xaAE6903cBe188861c7AeD8e39A873E8E6b45B7BE
// от аккаунта 0xfa8Bc763A4537BC5266173a1a7f4A60C7Fd48EF6