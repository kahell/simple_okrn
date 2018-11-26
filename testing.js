const arr = [1, 2, 3, 4];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function customizeAwait(arr, cb) {
  for (let i = 0; i < arr.length; i++) {
    await cb({
      index: arr[i]
    });
  }
}

(async () => {
  await customizeAwait(arr, async ({ index }) => {
    await sleep(1000);
    console.log(index);
  });
  console.log("DONE");
})();
