// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AgentReputation
 * @dev A simple registry for AI Agents to build on-chain trust history.
 * Hackathon Track: Celo Identity / ERC-8004 Concept
 */
contract AgentReputation {
    struct AgentProfile {
        string name;
        uint256 successfulTasks;
        uint256 reputationScore;
        bool isVerified;
    }

    mapping(address => AgentProfile) public agents;

    event AgentRegistered(address indexed agent, string name);
    event TaskCompleted(address indexed agent, uint256 newScore);

    // 1. Agent registers their identity
    function registerAgent(string memory _name) external {
        require(bytes(agents[msg.sender].name).length == 0, "Already registered");
        agents[msg.sender] = AgentProfile(_name, 0, 100, true);
        emit AgentRegistered(msg.sender, _name);
    }

    // 2. Agent calls this after finishing a job (Self-reporting for MVP)
    // In production, this would be called by an Oracle or the user verifying the job.
    function recordSuccess() external {
        require(agents[msg.sender].isVerified, "Not a verified agent");
        
        agents[msg.sender].successfulTasks += 1;
        agents[msg.sender].reputationScore += 10;
        
        emit TaskCompleted(msg.sender, agents[msg.sender].reputationScore);
    }

    // 3. View function for the frontend
    function getAgentScore(address _agent) external view returns (uint256) {
        return agents[_agent].reputationScore;
    }
}
