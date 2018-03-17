import Web3 from 'web3';
let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    //код выполняется в браузере, определен объект window
    //а также установлено и запущено расширение Metamask (web3)
    web3 = new Web3(window.web3.currentProvider);
    
} else {
    //код выполняется на сервере или пользователь не установил MetaMask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/V4TdOxWqFxt4ebK2hBam' 
    );
    web3 = new Web3(provider);
}

export default web3;