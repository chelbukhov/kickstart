pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        // minimum - это аргумент minimumContribution для констуктора контракта Campaign
        address newCampaign = new Campaign(minimum, msg.sender);  // создание нового контракта Campaign в блокчейне
                                                        // и сохранение его адреса в переменной newCampaign
        deployedCampaigns.push(newCampaign);            // добавление нового адреса в массив адресов кампаний
    }
    
    function getDeployedCampaigns() public view returns(address[]) {
        return deployedCampaigns;
    }
    
}

contract Campaign {
    struct Request {        // описание структуры, не создает экземпляров
        string description; // аналог класса
        uint value;
        address recipient;
        bool complete;
        uint approvalCount; // счетчик голосов
        mapping(address => bool) approvals;
    }
    
    Request[] public requests;  // массив запросов
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount; //счетчик участников

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // конструктор контракта Campaign
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);        

        approvers[msg.sender] = true;
        approversCount++;
    }        
    
    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
            description: description, 
            value: value, 
            recipient: recipient, 
            complete: false, 
            approvalCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];  //получаем переменную текущего запроса в хранилище
        
        require(approvers[msg.sender]); //проверка, что человек является участником
        require(!request.approvals[msg.sender]); //проверка, что участник еще не голосовал по данному запросу
        
        request.approvals[msg.sender] = true;   //добавляем участника в список проголосовавших по данному запросу
        request.approvalCount++;    //увеличиваем счетчик голосов
        
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(request.approvalCount > (approversCount / 2)); //проверка, что число проголосовавших больше половины общего числа участников
        require(!request.complete); // проверка, что запрос еще не был выполнен
        
        request.recipient.transfer(request.value); //отправка денег получателю запроса
        request.complete = true;    // установка флага - выполнен
        
        // Примечание_мое
        // С точки зрения безопасности две строки выше нужно поменять местами, т.к. иначе возможна двойная трата средств
        // из-за временной задержки BlockTime.
        
        
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
        ) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
