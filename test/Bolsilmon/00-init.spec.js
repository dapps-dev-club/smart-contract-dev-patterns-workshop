const assert = require('assert');

const Bolsilmon = artifacts.require('Bolsilmon');

contract('Bolsilmon - initial state', () => {
  it('should initialise', async () => {
    assert.doesNotThrow(async () => {
      await Bolsilmon.deployed();
    });
  });
});
