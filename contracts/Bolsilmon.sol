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

  // state variables
  uint256 public numMons = 0;
  mapping(uint256 => Mon) public mons;
  mapping(uint256 => address) public monCreators;

  // modifiers

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
  }
}
