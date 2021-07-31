const names: Array<string> = ['Mario', 'Monica'];
names[0].split(' ');

const promise = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    resolve('this is done');
  }, 2000);
});

promise.then(data => {
  data.split(' ');
});

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}
const mergedObject = merge({name: 'Mario'}, {age:43});
const mergedObject2 = merge({speed: 100}, {time:60});
// const mergedObject3 = merge({speed: 100}, 30);          ! doesn't work -- needs to be an object !
console.log(mergedObject.age);
console.log(mergedObject2.time);

interface Lengthy {
  length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = 'Got no value';
  if (element.length === 1) {
    descriptionText = 'Got 1 element!';
  }
  else if (element.length > 1) {
    descriptionText = 'Got ' + element.length + ' elements!';
  }
  return [element, descriptionText];
}

console.log(countAndDescribe('Hi there !'));            // 9
console.log(countAndDescribe(['Sports', 'Cooking']));   // 2
console.log(countAndDescribe([]));                      // 0

function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
  return 'Value: ' + obj[key];
}

console.log(extractAndConvert({name: 'Mario'}, 'name'));

class DataStorage<T extends string | number | boolean> {
  private data:T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) > 0) {
      this.data.splice(this.data.indexOf(item), 1);
    }
  }

  getItems() : T[] {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('string');
textStorage.removeItem('string');
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();
numberStorage.addItem(10);

/*const objectStorage = new DataStorage<object>();
const marioObject = {name: 'Mario'};
objectStorage.addItem(marioObject);
objectStorage.addItem({name: 'Monica'});
// ...
objectStorage.removeItem(marioObject);
console.log(objectStorage.getItems());*/

interface CourseGoal {
  title : string;
  description: string;
  completeUnit: Date;
}

function createCourseGoal(title: string, description: string, date: Date ) {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUnit = date;
  return courseGoal as CourseGoal;
}

const ournames:Readonly<string[]> = ['Mario', 'Monica'];
//ournames.push('Mario');  // will not work since ournames is read-only

