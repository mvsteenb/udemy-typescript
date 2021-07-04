enum Role { ADMIN, ADMIN_READ_ONLY, AUTHOR}

const person = {
  name: 'Mario',
  age : 42,
  hobbies: ['Motorcycles', 'Bodybuilding', 'Guitar'],  // TS knows that this is an array of strings
  role: Role.ADMIN
}

let tuple: [number, string];                           // tuple: 2 elements, first is a number, second is a string
tuple = [2, 'test'];

let favoriteActivities = ['Sports', 1];                // mixed array

let favoriteActivities2: string[];
favoriteActivities2 = ['Sports', 'Guitar'];            // only strings allowed !

let favoriteActivities3: any[];
favoriteActivities3 = ['Sports', 1];                   // any value allowed (not a good idea)

console.log(person.name);

for (const hobby of person.hobbies) {
  console.log(hobby.toUpperCase());                    // TS knows that a hobby is a string !
}