pragma solidity ^0.8.0;

/**
 * @title The most expensive message
 * @notice Web3 demo application
 * @author Chainkraft.com
 */
contract Message {

    // Owner can change fee rate and claim fees
    address public owner;

    // Current message author
    address public author;

    // Fee is measured as a part of feeRate/feeParts
    // ex: 20/10000 => 0.2%
    uint public constant feeParts = 10000;

    // Fee rate is N/feeParts
    uint public feeRate;

    // Current price of the message
    uint public price;

    // Current message
    string public message;

    // Maps ex message authors to their spent funds
    // Whenever message gets replaced, old funds are eligible for withdrawal
    mapping(address => uint) internal funds;

    // Events
    event FeeRateSet(uint oldFeeRate, uint newFeeRate);
    event MessageSet(string message, address indexed author, uint price);
    event OwnershipTransferred(address oldOwner, address newOwner);
    event Withdrawal(address recipient, uint amount, uint fee);

    /**
     * @dev Reverts if called by an account other than the owner
     */
    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner");
        _;
    }

    /**
     * @notice Sets the default owner, author and message
     */
    constructor() {
        owner = msg.sender;
        author = msg.sender;
        message = "Hello world";
    }

    /**
     * @notice Sets a new message if msg.value is bigger than the current price.
     * Funds of previous message are assigned to author's withdrawable funds
     * @param _message The new message
     */
    function setMessage(string calldata _message) external payable {
        require(msg.value > price, "Not enough ether");

        // give back previous author money
        funds[author] += price;

        price = msg.value;
        author = msg.sender;
        message = _message;
        emit MessageSet(message, author, price);
    }

    /**
     * @notice Gets the withdrawable balance of the specified address
     * @param _address The address to query the the balance of
     * @return An uint256 representing the amount owned by the passed address
     */
    function balanceOf(address _address) public view returns (uint) {
        return funds[_address];
    }

    /**
     * @notice Transfer funds to a msg.sender
     * @dev Calculated fee is deducted from eligible funds of a sender and added to contract owner's funds
     */
    function withdraw() public {
        uint _funds = funds[msg.sender];
        uint _fee = calculateFee(_funds);
        uint _principle = _funds - _fee;
        funds[msg.sender] = 0;
        if (feeRate > 0) {
            funds[owner] += _fee;
        }

        (bool sent,) = msg.sender.call{value : _principle}("");
        require(sent, "Failure! Ether not sent");
        emit Withdrawal(msg.sender, _principle, _fee);
    }

    /**
     * @notice Sets a new owner address
     * @param _owner The address allowed to set the fee rate and the fee recipient
     */
    function setOwner(address _owner) public onlyOwner {
        address _oldOwner = owner;
        owner = _owner;
        emit OwnershipTransferred(_oldOwner, owner);
    }

    /**
     * @notice Sets a fee rate. Set _feeRate=0 to disable it
     * @param _feeRate The new fee rate to collect while withdrawing funds
     */
    function setFeeRate(uint _feeRate) public onlyOwner {
        require(_feeRate <= feeParts, "Fee rate above 100%");

        uint _oldFeeRate = feeRate;
        feeRate = _feeRate;
        emit FeeRateSet(_oldFeeRate, feeRate);
    }

    /**
     * @notice Calculates fee for a specified value.
     * ex: feeParts=10000 & feeRate=20 then calculateFee(100) = 0.2
     * @param _value The value to calculate fee for
     * @return An uint256 representing the fee. If feeRate = 0, then 0
     */
    function calculateFee(uint _value) internal view returns (uint) {
        if (feeRate > 0) {
            return _value * feeRate / feeParts;
        }
        return 0;
    }
}
