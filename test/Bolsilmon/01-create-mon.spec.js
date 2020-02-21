const assert = require('assert');

const {
  BN,
  expectRevert,
  expectEvent,
} = require('@openzeppelin/test-helpers');

const Bolsilmon = artifacts.require('Bolsilmon');

contract('Bolsilmon - createMon', (accounts) => {
  const [
    account1,
  ] = accounts;

  const geneSeed =
    '0x0102030405060708090a0b0c0d0e0f100102030405060708090a0b0c0d0e0f10';
  const geneSeedBytes =
    web3.utils.hexToBytes(geneSeed);

  it('should bar when not paying enough', async () => {
    const inst = await Bolsilmon.deployed();

    await expectRevert(
      inst.createMon(
        geneSeedBytes,
        {
          from: account1,
          value: web3.utils.toWei('0.09', 'ether'),
        },
      ),
      'You need to pay more',
    );
  });

  it('should allow', async () => {
    const inst = await Bolsilmon.deployed();

    await inst.createMon(
      geneSeedBytes,
      {
        from: account1,
        value: web3.utils.toWei('0.11', 'ether'),
      },
    );

    const numMons = await inst.numMons.call();

    assert.equal(numMons.toString(), '1');

    const monCreator = await inst.monCreators.call(new BN(1));

    assert.equal(monCreator, account1,
      'creator unexpected value');

    const mon = await inst.mons.call(new BN(1));

    assert.ok(mon.createBlock > 0,
      'createBlock not set');
    assert.equal(mon.born, false,
      'born unexpected value');
    assert.equal(mon.genes, geneSeed,
      'genes unexpected value');
  });
});
