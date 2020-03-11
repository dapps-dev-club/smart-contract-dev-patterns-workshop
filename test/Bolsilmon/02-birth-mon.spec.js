
const assert = require('assert');

const {
  BN,
  expectEvent,
  expectRevert,
} = require('@openzeppelin/test-helpers');

const testUtil = require('./test-util.js');

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

    await expectRevert(
      inst.birthMon(
        new BN(1),
        {
          from: account2,
          value: new BN(0),
        },
      ),
      'You are not the creator',
    );
  });

  it('should bar when did not wait for long enough', async () => {
    const inst = await Bolsilmon.deployed();

    const birthWaitBlocks = await inst.birthWaitBlocks.call();
    if (birthWaitBlocks.lt(1)) {
      console.warn('skipping redundant test for birthWaitBlocks');
      return true;
    }

    await expectRevert(
      inst.birthMon(
        new BN(1),
        {
          from: account1,
          value: new BN(0),
        },
      ),
      'You must wait longer',
    );

    const numMons = await inst.numMons.call();
    assert.equal(numMons.toString(), '1',
      'numMons unexpected value');

    const mon = await inst.mons.call(new BN(1));

    // mon is still created
    assert.ok(mon.createBlock > 0,
      'createBlock not set');
    // but mon is not born
    assert.equal(mon.born, false,
      'born unexpected value');
    // since mon is not born, its genes are still the seed value
    assert.equal(mon.genes, geneSeed,
      'genes unexpected value');

    const monCreator = await inst.monCreators(new BN(1));
    assert.equal(monCreator, account1,
      'creator should remain same before mon is born');
  });

  it('should allow', async () => {
    const inst = await Bolsilmon.deployed();

    await testUtil.waitBeforeBirth(inst);

    const txInfo = await inst.birthMon(
      new BN(1),
      {
        from: account1,
        value: new BN(0),
      },
    );

    const numMons = await inst.numMons.call();
    assert.equal(numMons.toString(), '1',
      'unexpected numMons');

    const mon = await inst.mons.call(new BN(1));

    assert.ok(mon.createBlock > 0,
      'createBlock not set');
    assert.equal(mon.born, true,
      'born unexpected value');
    assert.notEqual(mon.genes, geneSeed,
      'genes unexpected value');
    // TODO potentially also compute the hash here too,
    // instead of merely checking that it has changed

    const monCreator = await inst.monCreators(new BN(1));
    assert.equal(monCreator, account1,
      'creator should remain same after mon is born');

    expectEvent(
      txInfo,
      'MonBirth',
      {
        monId: '1',
        owner: account1,
      },
    );
  });

  it('should bar when attempt to birth same mon twice', async () => {
    const inst = await Bolsilmon.deployed();

    await expectRevert(
      inst.birthMon(
        new BN(1),
        {
          from: account1,
          value: new BN(0),
        },
      ),
      'Mon may not be born twice',
    );
  });
});
