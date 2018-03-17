const assert = require ('assert');              // утверждения
const ganache = require ('ganache-cli');        // тестовая сеть
const Web3 = require ('web3');                  // библиотека для подключения к ефириуму
const web3 = new Web3(ganache.provider());      // настройка провайдера

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    // получаем контракт из скомпилированного ранее файла .json
    // разворачиваем его в тестовой сети и отправляем транзакцию
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });
    
    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    //две строки выше можно записать в другом синтаксисе в одну строку
 
    //[campaignAddress] = await factory.methods.getDeployedCampaigns().call();
 
    // квадратные скобки говорят, что справа о знака равенства массив и нужно 
    // взять его первый элемент и присвоить переменной

    
    //получаем развернутый ранее контракт по указанному адресу
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );

});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('mark caller is campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5', //  сумма меньше минимального взноса
                from: accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error);
            //правильным завершением данного теста является наличие ошибки
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
        .createRequest('Buy batteries', '100', accounts[1])
        .send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy batteries', request.description);
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
            // 10 эфиров для входа
        })

        await campaign.methods
        .createRequest('Test', web3.utils.toWei('5', 'ether'), accounts[1])
        .send({ from: accounts[0], gas: '1000000'});

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        //console.log(balance);
        assert(balance > 104);


    });

});