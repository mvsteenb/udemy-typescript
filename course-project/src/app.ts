const addNumbers = (a: number, b: number = 1) => a + b;

console.log(addNumbers(1, 2));
console.log(addNumbers(1));

const printOutput = (output: string | number) => {
  console.log(output);
}

const printOutput2 : (a: number | string) => void = output => console.log(output); 

printOutput(addNumbers(5, 2));

const mbutton = document.querySelector('button');
if (mbutton) {
  mbutton.addEventListener('click', event => console.log(event));
}

const hobbies = ['Sports', 'Cooking'];
const activeHobbies = ['Hiking'];
activeHobbies.push(...hobbies);

console.log(hobbies[0]);

const personObject = {
  firstName: 'Mario',
  age: 43
}

const copiedPerson1 = person;       // copies pointer !!!
const copiedPerson2 = {...person};  // creates a real copy of the object

const addNumbers2 = (...numbers: number[]) => {
  return numbers.reduce((curResult, curVal) => { 
    return curResult + curVal;
  }, 0);
} 

const addedNumbers2 = addNumbers2(10, 2, 8, 20, 1);

const addNumbers3 = (...numbers: [number, number, number]) => {
  return numbers.reduce((curResult, curVal) => { 
    return curResult + curVal;
  }, 0);
} 

const addedNumber3 = addNumbers3(10, 2, 8);

// array destucturing :
const hobby1 = hobbies[0];
const hobby2 = hobbies[1];

const [hobby3, hobby4, ...remainingHobbies] = hobbies;

const { firstName: userNameElement, age } = personObject;