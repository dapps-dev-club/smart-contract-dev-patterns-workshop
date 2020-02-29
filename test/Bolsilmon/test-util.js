const {
  time,
} = require('@openzeppelin/test-helpers');

async function waitBeforeAction(inst, waitActionVariableName) {
  const actionWaitBlocks =
    await inst[waitActionVariableName].call();
  if (actionWaitBlocks.gt(0)) {
    for (let blockIdx = 0; blockIdx < actionWaitBlocks.toNumber(); ++blockIdx) {
      await time.advanceBlock();
    }
    // When this PR is released:
    // https://github.com/OpenZeppelin/openzeppelin-test-helpers/pull/94
    // we will be able to use `time.advanceBlockTo` instead:
    // const nowBlock = await time.latestBlock();
    // const waitedBlock = nowBlock.add(actionWaitBlocks);
    // await time.advanceBlockTo(waitedBlock);
  }
}
