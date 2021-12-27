// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DYFFarm is ChainlinkClient, Ownable {
    IERC20 private dyfToken;

    mapping(address => mapping(address => uint)) public stakingBalance;
    mapping(address => uint) public uniqueTokensStaked;
    mapping(address => address) public tokenPriceFeedContract;
    address[] private allowedTokens;
    address[] public stakers;

    constructor(address _dyfToken) public {
        dyfToken = IERC20(_dyfToken);
    }

    function stakeToken(uint _amount, address token) public {
        require(_amount > 0, "Amount should be greater than 0.");
        if (isTokenAllowed(token)) {
            IERC20(token).transferFrom(msg.sender, address(this), _amount);
            updateUniqueTokensStaked(msg.sender, token);
            stakingBalance[msg.sender][token] = stakingBalance[msg.sender][token] + _amount;
            if(uniqueTokensStaked[msg.sender] == 1) {
                stakers.push(msg.sender);
            }
        }
    }

    function unstakeToken(address token) public {
        uint balance = stakingBalance[msg.sender][token];
        require(balance > 0, "Balance less than 0.");
        IERC20(token).transferFrom(msg.sender, balance);
        stakingBalance[msg.sender][token] = 0;
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;
    }

    function addAllowedToken(address token) public {
        if (!isTokenAllowed(token)) {
            allowedTokens.push(token);
        }
    }

    function isTokenAllowed(address token) public view returns (bool) {
        for (uint i=0;i < allowedTokens.length;i++) {
            if (allowedTokens[i] == token) {
                return true;
            }
        }
        return false;
    }

    function setPriceFeedContract(address token, address priceFeedContract) public {
        tokenPriceFeedContract[token] = priceFeedContract;
    }

    function getUserTotalValue(address user) public view returns (uint) {
        uint totalValue = 0;
        for (uint i=0;i < allowedTokens.length;i++) {
            totalValue = totalValue + getUserStakingBalanceEthValue(user, allowedTokens[i]);
        }
        return totalValue;
    }

    function getUserStakingBalanceEthValue(address user, address token) public view returns (uint) {
        if (uniqueTokensStaked[user] <= 0) {
            return 0;
        }
        return stakingBalance[user][token] * getTokenEthPrice(token) / (10**18);
    }

    function getTokenEthPrice(address token) public view returns (uint) {
        address priceContract = tokenPriceFeedContract[token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(priceContract);
        (
            /* uint80 roundID */,
            int price,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData();
        return uint(price);
    }

    function issueToken() public onlyOwner {
        for (uint i=0;i < stakers.length;i++) {
            address recipient = stakers[i];
            dyfToken.transfer(recipient, getUserTotalValue(recipient));
        }
    }

    function updateUniqueTokensStaked(address user, address token) internal {
        if(stakingBalance[user][token] == 0) {
            uniqueTokensStaked[user] = uniqueTokensStaked[user] + 1;
        }
    }
}


// todo: add events