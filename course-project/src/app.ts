type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee;

const emp: ElevatedEmployee = {
  name: 'Mario',
  privileges: ['create-server'],
  startDate: new Date()
}

type Numeric = number | boolean;

type CombinableType = string | number;
type Universal = CombinableType & Numeric;

function addCombinable(a: number, b: number) : number;
function addCombinable(a: string, b: string) : string;
function addCombinable(a: number, b: string) : string;
function addCombinable(a: string, b: number) : string;
function addCombinable(a: CombinableType, b: CombinableType) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a+b;
}

const result = addCombinable(1, 5);
const result2 = addCombinable('Mario', ' Monica');
const fields = result2.split(' ');

const fetchedUserData = {
  id: 'u1',
  name: 'Max',
  job: {title: 'CEO', description: 'My own company'}
}

console.log(fetchedUserData?.job?.title);

const userInput2 = null;
const storedData = userInput2 || 'DEFAULT';   // also prints 'DEFAULT' where userInput2 = ''
const storedData2 = userInput2 ?? 'DEFAULT';   // also prints 'DEFAULT' where userInput2 = ''
console.log(storedData2);

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log('Name' + emp.name);
  if ('privileges' in emp) {
    console.log('Privileges:' + emp.privileges);
  }
  if ('startDate' in emp) {
    console.log('Start date:' + emp.startDate);
  }

}

printEmployeeInformation(emp);

class Car {
  drive() {
    console.log('driving...');
  }  
}

class Truck {
  drive() {
    console.log('driving truck...');
  }  
  loadCargo(amount: number) {
    console.log('Loading cargo: ' + amount)
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  if ('loadCargo' in vehicle) {
    vehicle.loadCargo(1000);
  }
}

function useVehicle2(vehicle: Vehicle) {
  vehicle.drive();
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
useVehicle(v2);
useVehicle2(v1);
useVehicle2(v2);

interface Bird {
  type: 'Bird';
  flyingSpeed: number;
}

interface Horse {
  type: 'Horse';
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  let speed;
  switch(animal.type) {
    case 'Bird' : 
      speed = animal.flyingSpeed;
      break;
    case 'Horse' : 
    speed = animal.runningSpeed;
      break;
  }
  console.log('Moving at speed: ' + speed);
}

moveAnimal({type: 'Bird', flyingSpeed: 100});

const paragraph = document.getElementById('message-output');
const userInputElement = <HTMLInputElement> document.getElementById('user-input');
const userInputElement2 = document.getElementById('user-input')! as HTMLInputElement; // ! means will never be null
userInputElement.value = 'Hi There';
userInputElement2.value = 'Hi There';

interface ErrorContainer { // {email: 'Not a valid email', userName: 'Must start with a character'}
  [prop: string]: string;
}

const error: ErrorContainer = {
  email: 'Not a valid email',
  username: 'Must start with a capital character'
};