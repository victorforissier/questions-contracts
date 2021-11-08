// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract ClassicBounties {
  using SafeMath for uint256;

  /* #structs */
  struct Bounty {
    address payable issuer; 
    // Individuals who submitted the bounty question
    uint deadline; 
    // The Unix timestamp before which all submissions must be made, and after which refunds may be processed
    uint balance; 
    // The number of tokens which the bounty is able to pay out or refund
    bool hasBeenAnswered; 
    // A boolean storing whether or not the bounty has paid out at least once, meaning refunds are no longer allowed
    Fulfillment[] fulfillments; 
    // An array of Fulfillments which store the various submissions which have been made to the bounty
    Contribution[] contributions; 
    // An array of Contributions which store the contributions which have been made to the bounty
  }

  struct Fulfillment {
    string answerId; // An array of addresses who should receive payouts for a given submission
    address payable submitter; // The address of the individual who submitted the fulfillment, who is able to update the submission as needed
    uint timestamp; // The Unix timestamp at which the submission was made
  }

  struct Contribution {
    address payable contributor; // The address of the individual who contributed
    uint amount; // The amount of tokens the user contributed
    bool refunded; // A boolean storing whether or not the contribution has been refunded yet
  }

  /* #storage */
  uint public numBounties; // An integer storing the total number of bounties in the contract
  mapping(uint => Bounty) public bounties; // A mapping of bountyIDs to bounties
  mapping (uint => mapping (uint => bool)) public tokenBalances; // A mapping of bountyIds to tokenIds to booleans, storing whether a given bounty has a given ERC721 token in its balance


  address public owner; // The address of the individual who's allowed to set the metaTxRelayer address
  
  bool public callStarted; // Ensures mutex for the entire contract

/* Modifiers */
  modifier callNotStarted(){
    require(!callStarted);
    callStarted = true;
    _;
    callStarted = false;
  }

  modifier validateBountyArrayIndex(
    uint _index)
  {
    require(_index < numBounties);
    _;
  }

  modifier validateContributionArrayIndex(
    uint _bountyId,
    uint _index)
  {
    require(_index < bounties[_bountyId].contributions.length);
    _;
  }

  modifier validateFulfillmentArrayIndex(
    uint _bountyId,
    uint _index)
  {
    require(_index < bounties[_bountyId].fulfillments.length);
    _;
  }

  modifier onlyIssuer(address _sender, uint _bountyId) 
  {
    require(_sender == bounties[_bountyId].issuer);
    _;
  }

  modifier onlySubmitter(
    address _sender,
    uint _bountyId,
    uint _fulfillmentId)
  {
    require(_sender ==
            bounties[_bountyId].fulfillments[_fulfillmentId].submitter);
    _;
  }

  modifier onlyContributor(
    address _sender,
    uint _bountyId,
    uint _contributionId
  )
  {
    require(_sender == bounties[_bountyId].contributions[_contributionId].contributor);
    _;
  }

  modifier isApprover(address _sender, uint _bountyId)
  {
    require(_sender == owner);
    _;
  }

  modifier hasNoAnswers(
    uint _bountyId)
  {
    require(!bounties[_bountyId].hasBeenAnswered);
    _;
  }
  
  modifier isOverDeadline(
    uint _bountyId)
  {
    require(block.timestamp > bounties[_bountyId].deadline); // Refunds may only be processed after the deadline has elapsed
    _;
  }

  modifier hasNotRefunded(
    uint _bountyId,
    uint _contributionId)
  {
    require(!bounties[_bountyId].contributions[_contributionId].refunded);
    _;
  }

  modifier senderIsValid(address _sender)
  {
    require(msg.sender == _sender);
    _;
  }

  /* #public functions */
  constructor() {
    owner = msg.sender;
  }

  // @dev issueBounty(): creates a new bounty
  // @param _sender the sender of the transaction issuing the bounty (should be the same as msg.sender unless the txn is called by the meta tx relayer)
  // @param _questionId questionID in the database
  // @param _deadline the timestamp which will become the deadline of the bounty
  // @param _depositAmount the amount of tokens being deposited to the bounty, which will create a new contribution to the bounty
  function issueBountyAndContribute(
      address payable _sender,
      string memory _questionId,
      uint _deadline,
      uint _depositAmount
    )
    public
    payable     
    senderIsValid(_sender)
    returns(uint)
  {
    uint bountyId = issueBounty(_sender, _questionId, _deadline);

    contribute(_sender, bountyId, _depositAmount);

    return (bountyId);
  }

  // TODO make public internal
  function issueBounty(
    address payable _sender,
    string memory _questionId,
    uint _deadline)
    public 
    returns (uint)
  {
    uint bountyId = numBounties; // The next bounty's index will always equal the number of existing bounties
    Bounty storage newBounty = bounties[bountyId];
    newBounty.issuer = _sender;
    newBounty.deadline = _deadline;

    // Only if ERC20
    // newBounty.token = _token;

    numBounties = numBounties.add(1); // Increments the number of bounties, since a new one has just been added

    emit BountyIssued(bountyId,
                      _sender,
                      _questionId, // Instead of storing the string on-chain, it is emitted within the event for easy off-chain consumption
                      _deadline);

    return (bountyId);
  }




  // @dev contribute(): Allows users to contribute tokens to a given bounty.
  //                    Contributing merits no privelages to administer the
  //                    funds in the bounty or accept submissions. Contributions
  //                    are refundable but only on the condition that the deadline
  //                    has elapsed, and the bounty has not yet paid out any funds.
  //                    All funds deposited in a bounty are at the mercy of a
  //                    bounty's issuers and approvers, so please be careful!
  // @param _sender the sender of the transaction issuing the bounty (should be the same as msg.sender
  // @param _bountyId the index of the bounty
  // @param _amount the amount of tokens being contributed
  // TODO make public internal
  function contribute(
    address payable _sender,
    uint _bountyId,
    uint _amount)
    public
    payable
    senderIsValid(_sender)
    validateBountyArrayIndex(_bountyId)
    callNotStarted
  {

    require(_amount > 0, 'Amount inferior to 0.'); // Contributions of 0 tokens or token ID 0 should fail
    require(msg.value == _amount, 'Amount not equal to msg.value.'); // Ensures that the amount being contributed is equal to the amount being sent

    bounties[_bountyId].contributions.push(Contribution(_sender, _amount, false)); // Adds the contribution to the bounty
    bounties[_bountyId].balance = bounties[_bountyId].balance.add(_amount); // Increments the balance of the bounty

    uint contributionId = bounties[_bountyId].contributions.length - 1; // The contribution's index will always equal the number of existing contributions
    emit ContributionAdded(_bountyId, contributionId, _sender, _amount);
  }

  // @dev refundContribution(): Allows users to refund the contributions they've
  //                            made to a particular bounty, but only if the bounty
  //                            has not yet paid out, and the deadline has elapsed.
  // @param _sender the sender of the transaction issuing the bounty (should be the same as msg.sender unless the txn is called by the meta tx relayer)
  // @param _bountyId the index of the bounty
  // @param _contributionId the index of the contribution being refunded
  function refundContribution(
    address _sender,
    uint _bountyId,
    uint _contributionId)
    public
    senderIsValid(_sender)
    validateBountyArrayIndex(_bountyId)
    validateContributionArrayIndex(_bountyId, _contributionId)
    onlyContributor(_sender, _bountyId, _contributionId)
    hasNoAnswers(_bountyId)
    hasNotRefunded(_bountyId, _contributionId)    
    isOverDeadline(_bountyId)
    callNotStarted
  {

    Contribution storage contribution = bounties[_bountyId].contributions[_contributionId];

    contribution.refunded = true;

    transferTokens(_bountyId, contribution.contributor, contribution.amount); // Performs the disbursal of tokens to the contributor

    emit ContributionRefunded(_bountyId, _contributionId);
  }

  // @dev refundMyContributions(): Allows users to refund their contributions in bulk
  // @param _sender the sender of the transaction issuing the bounty (should be the same as msg.sender unless the txn is called by the meta tx relayer)
  // @param _bountyId the index of the bounty
  // @param _contributionIds the array of indexes of the contributions being refunded
  function refundMyContributions(
    address _sender,
    uint _bountyId,
    uint[] memory _contributionIds)
    public
    senderIsValid(_sender)
    isOverDeadline(_bountyId)
  {
    for (uint i = 0; i < _contributionIds.length; i++){
        refundContribution(_sender, _bountyId, _contributionIds[i]);
    }
  }

  // @dev refundContributions(): Allows users to refund their contributions in bulk
  // @param _sender the sender of the transaction issuing the bounty (should be the same as msg.sender)
  // @param _bountyId the index of the bounty
  // @param _contributionIds the array of indexes of the contributions being refunded
  function refundContributions(
    address _sender,
    uint _bountyId,
    uint[] memory _contributionIds)
    public
    senderIsValid(_sender)
    validateBountyArrayIndex(_bountyId)
    onlyIssuer(_sender, _bountyId)
    callNotStarted
    hasNoAnswers(_bountyId)
    isOverDeadline(_bountyId)
  {
    for (uint i = 0; i < _contributionIds.length; i++){
      require(_contributionIds[i] < bounties[_bountyId].contributions.length);

      Contribution storage contribution = bounties[_bountyId].contributions[_contributionIds[i]];

      require(!contribution.refunded);

      contribution.refunded = true;

      transferTokens(_bountyId, contribution.contributor, contribution.amount); // Performs the disbursal of tokens to the contributor
    }

    emit ContributionsRefunded(_bountyId, _sender, _contributionIds);
  }

  // @dev fulfillBounty(): Allows users to fulfill the bounty to get paid out
    // @param _sender the sender of the transaction issuing the bounty (should be the same as msg.sender)
    // @param _bountyId the index of the bounty
    // @param _fulfillers the array of addresses which will receive payouts for the submission
    // @param _data the IPFS hash corresponding to a JSON object which contains the details of the submission (see docs for schema details)
  function fulfillBounty(
    address _sender,
    uint _bountyId,
    string memory _answerId)
    public
    senderIsValid(_sender)
    validateBountyArrayIndex(_bountyId)
  {
    // now that the bounty has been answered at least once, refunds are no longer possible
    bounties[_bountyId].hasBeenAnswered = true;
    bounties[_bountyId].fulfillments.push(Fulfillment(_answerId, _sender, block.timestamp));

    emit BountyFulfilled(_bountyId, _sender, _answerId, (bounties[_bountyId].fulfillments.length - 1), 
  }

  // @dev acceptFulfillment(): Allows any of the approvers to accept a given submission
  // @param _sender the sender of the transaction issuing the bounty (should be the same as msg.sender)
  // @param _bountyId the index of the bounty
  // @param _fulfillmentId the index of the fulfillment to be accepted
  // @param _tokenAmounts the array of token amounts which will be paid to the
  //                      fulfillers, whose length should equal the length of the
  //                      _fulfillers array of the submission. If the bounty pays
  //                      in ERC721 tokens, then these should be the token IDs
  //                      being sent to each of the individual fulfillers
  function acceptFulfillment(
    address _sender,
    uint _bountyId,
    uint _fulfillmentId,
    uint[] memory _tokenAmounts)
    public
    senderIsValid(_sender)
    validateBountyArrayIndex(_bountyId)
    validateFulfillmentArrayIndex(_bountyId, _fulfillmentId)
    isApprover(_sender, _bountyId)
    callNotStarted
  {

    Fulfillment storage fulfillment = bounties[_bountyId].fulfillments[_fulfillmentId];

    require(_tokenAmounts.length == fulfillment.fulfillers.length); // Each fulfiller should get paid some amount of tokens (this can be 0)

    for (uint256 i = 0; i < fulfillment.fulfillers.length; i++){
        if (_tokenAmounts[i] > 0){
          // for each fulfiller associated with the submission
          transferTokens(_bountyId, fulfillment.fulfillers[i], _tokenAmounts[i]);
        }
    }
    emit FulfillmentAccepted(_bountyId, _fulfillmentId, _tokenAmounts);
  }

  // @dev getBounty(): Returns the details of the bounty
  // @param _bountyId the index of the bounty
  // @return Returns a tuple for the bounty
  function getBounty(uint _bountyId) external view returns (Bounty memory) 
  {
    return bounties[_bountyId];
  }

  function transferTokens(uint _bountyId, address payable _to, uint _amount)
    internal
  {
      require(_amount > 0); // Sending 0 tokens should throw
      require(bounties[_bountyId].balance >= _amount);

      bounties[_bountyId].balance = bounties[_bountyId].balance.sub(_amount);

      _to.transfer(_amount);
  }

  /* #events  */
  event BountyIssued(uint _bountyId, address payable _issuer, string _questionId, uint _deadline);
  event ContributionAdded(uint _bountyId, uint _contributionId, address payable _contributor, uint _amount);
  event ContributionRefunded(uint _bountyId, uint _contributionId);
  event ContributionsRefunded(uint _bountyId, address _issuer, uint[] _contributionIds);
  event BountyFulfilled(uint _bountyId, uint _sender, string _answerId, uint numFulfillments);
  event FulfillmentAccepted(uint _bountyId, uint  _fulfillmentId, uint[] _tokenAmounts);
  event LogMessage(string _message);
}
