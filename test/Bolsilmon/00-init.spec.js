const assert = require('assert');

const Bolsilmon = artifacts.require('Bolsilmon');

contract('Bolsilmon - initial state', () => {
  it('should initialise', async () => {
    assert.doesNotThrow(async () => {
      await Bolsilmon.deployed();
    });
  });

  it('initial state', async () => {
    const inst = await Bolsilmon.deployed();

    const numMons = await inst.numMons.call();

    assert.equal(numMons.toString(), '0',
      'Unexpected numMons initial value');
  });
});
