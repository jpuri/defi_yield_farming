// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DYFToken is ERC20 {
    constructor() public ERC20("DYFToken", "DYF") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}
