pragma solidity 0.5.16;

contract Bolsilmon {
  // structs
  struct Mon {
    uint256 createBlock;
    bool born;
    bytes32 genes;
  }

  // events
  event MonCreate (
    uint256 indexed monId,
    address indexed owner
  );

  event MonBirth (
    uint256 indexed monId,
    address indexed owner
  );

  // state variables
  uint256 public numMons = 0;
  mapping(uint256 => Mon) public mons;
  mapping(uint256 => address) public monCreators;

  uint256 public birthWaitBlocks = 1;

  uint256 public createPrice = 0.1 ether;

  // modifiers
  modifier minPayment(
    uint256 amount
  ) {
    require(
      msg.value >= amount,
      "You need to pay more"
    );
    _;
  }

  // functions
  constructor()
    public
  {
    // do nothing
  }

  function createMon(
    bytes32 geneSeed
  )
    external
    payable
    minPayment(createPrice)
    returns(uint256 monId)
  {
    monId = ++numMons;
    Mon memory newMon = Mon(
      block.number,
      false,
      geneSeed
    );
    mons[monId] = newMon;
    monCreators[monId] = msg.sender;

    emit MonCreate(
      monId,
      msg.sender
    );
  }

  function birthMon(
    uint256 monId
  )
    external
  {
    require(
      monCreators[monId] == msg.sender,
      "You are not the creator"
    );
  }
}
