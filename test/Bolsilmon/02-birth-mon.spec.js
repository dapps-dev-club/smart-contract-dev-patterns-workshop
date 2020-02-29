
const assert = require('assert');

const {
  BN,
  expectEvent,
  expectRevert,
} = require('@openzeppelin/test-helpers');

const Bolsilmon = artifacts.require('Bolsilmon');

contract('Bolsilmon - birthMon', (accounts) => {
  const [
    account1,
    account2,
  ] = accounts;

  const geneSeed =
    '0x0102030405060708090a0b0c0d0e0f100102030405060708090a0b0c0d0e0f10';

  before(async () => {
    const inst = await Bolsilmon.deployed();

    await inst.createMon(
      web3.utils.hexToBytes(geneSeed),
      {
        from: account1,
        value: web3.utils.toWei('0.11', 'ether'),
      },
    );
  });

  it('should bar when not creator', async () => {
    const inst = await Bolsilmon.deployed();

    await inst.birthMon(
      new BN(1),
      {
        from: account2,
        value: new BN(0),
      },
    );
  });
});
