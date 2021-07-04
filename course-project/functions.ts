function add(n1: number, n2: number) {
  return n1 + n2;
}

function printResult(num: number) {
  console.log('result: ' + num);
}

function addAndHandle(n1: number, n2: number, callback: (num: number) => void) {
  const result = n1 + n2;
  callback(result);
}

addAndHandle(1, 3, (result) => {
  console.log(result);
});

printResult(add(5, 12));

let combineValues: (a: number, b: number) => number;
combineValues = add;
console.log(combineValues(8, 8));