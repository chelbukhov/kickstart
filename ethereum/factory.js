import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xaAE6903cBe188861c7AeD8e39A873E8E6b45B7BE'
);

export default instance;