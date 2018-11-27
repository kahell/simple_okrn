const arr = [1, 2, 3, 4];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const test = `asd`;
asdasd
// function array(arr) {
//   for (let i = 0; i < arr.length; i++) {
//     sleep(1000);
//     console.log(arr[i]);
//   }
// }

// Immadiate invoke function expression
// (async () => {
//   await array(arr);
//   console.log("done");
// })();

function power(i, y) {
  if (y < 1 && y > 0) {
    return 1;
  }

  if (y < 0) {
    return 1 / power(i, -y);
  }

  if (y !== 0) {
    return i * power(i, y - 1);
  }

  return 1;
}

console.log(power(3, 3)); // 9
console.log(power(3, -1)); // 8
console.log(power(3, -2)); // 8
console.log(power(3, 0)); // 8
console.log(power(3, -1)); // 8

// console.log("DONE");

// async function customizeAwait(arr, cb) {
//   await cb({
//     index: arr[1]
//   });
// }

// (async () => {
//   await customizeAwait(arr, async ({ index }) => {
//     await sleep(1000);
//     console.log(index);
//   });
//   console.log("DONE");
// })();
