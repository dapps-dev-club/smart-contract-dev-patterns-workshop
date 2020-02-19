pragma solidity 0.5.16;

contract Bolsilmon {
  // structs
  struct Mon {
    uint256 createBlock;
    bool born;
    bytes32 genes;
  }

  // events

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
}
