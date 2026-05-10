// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NollyWin is Ownable, ReentrancyGuard {
    enum State { Active, Settled, EmergencyWithdrawn }

    struct Strategy {
        uint256 costBasis;
        uint256 finalETH;
        uint256 startTime;
        uint256 endTime;
        State currentState;
        address user;
        address referral; // Keeps track of who referred the user
    }

    uint256 public nextStrategyId;
    address public treasuryWallet;
    
    uint256 public constant REFERRAL_FEE_BPS = 100; // 1%
    uint256 public constant TREASURY_FEE_BPS = 200; // 2%
    uint256 public constant MAX_FUND_HOLD_TIME = 30 days;

    mapping(uint256 => Strategy) public strategies;

    event StrategyStarted(uint256 indexed id, address indexed user, uint256 amount);
    event Settled(uint256 indexed id, uint256 finalAmount, uint256 totalFees);
    event EmergencyWithdrawal(uint256 indexed id, uint256 amount);

    constructor(address _treasury) Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury address");
        treasuryWallet = _treasury;
    }

    function startStrategy(address _referrer) external payable nonReentrant {
        require(msg.value > 0, "Deposit must be greater than 0");
        
        uint256 id = nextStrategyId++;
        strategies[id] = Strategy({
            costBasis: msg.value,
            finalETH: 0,
            startTime: block.timestamp,
            endTime: 0,
            currentState: State.Active,
            user: msg.sender,
            referral: _referrer
        });
        emit StrategyStarted(id, msg.sender, msg.value);
    }

    function settleStrategy(uint256 _id, uint256 _finalETH) external onlyOwner nonReentrant {
        Strategy storage strategy = strategies[_id];
        require(strategy.currentState == State.Active, "Strategy not active");
        
        strategy.finalETH = _finalETH;
        strategy.endTime = block.timestamp;
        strategy.currentState = State.Settled;

        // Total fee is always 3% (300 BPS)
        uint256 totalFeeBPS = TREASURY_FEE_BPS + REFERRAL_FEE_BPS;
        uint256 totalFee = (_finalETH * totalFeeBPS) / 10000;
        
        uint256 treasuryFee;
        uint256 referralFee = 0;

        // NEW LOGIC: Referral only gets paid if there is a PROFIT
        // If finalETH <= costBasis, the Treasury takes the full 3%
        if (_finalETH > strategy.costBasis && strategy.referral != address(0)) {
            referralFee = (_finalETH * REFERRAL_FEE_BPS) / 10000;
            treasuryFee = totalFee - referralFee;
            _safeTransfer(strategy.referral, referralFee);
        } else {
            treasuryFee = totalFee;
        }

        _safeTransfer(treasuryWallet, treasuryFee);
        
        // Payout to user is the final amount minus the total 3% fee
        uint256 userPayout = _finalETH - totalFee;
        _safeTransfer(strategy.user, userPayout);
        
        emit Settled(_id, _finalETH, totalFee);
    }

    function emergencyWithdraw(uint256 _id) external nonReentrant {
        Strategy storage strategy = strategies[_id];
        require(strategy.currentState == State.Active, "Cannot withdraw");
        
        require(
            msg.sender == strategy.user || 
            (msg.sender == owner() && block.timestamp > strategy.startTime + MAX_FUND_HOLD_TIME),
            "Unauthorized or not stalled"
        );

        strategy.currentState = State.EmergencyWithdrawn;
        uint256 amountToReturn = strategy.costBasis;
        
        _safeTransfer(strategy.user, amountToReturn);
        
        emit EmergencyWithdrawal(_id, amountToReturn);
    }

    function _safeTransfer(address _to, uint256 _amount) internal {
        if (_amount > 0) {
            (bool success, ) = _to.call{value: _amount}("");
            require(success, "Transfer failed");
        }
    }

    function updateTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid address");
        treasuryWallet = _newTreasury;
    }
}