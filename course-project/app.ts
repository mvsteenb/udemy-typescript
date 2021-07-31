type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: 'Mario',
  privileges: ['create-server'],
  startDate: new Date()
}

type CombinableType = string | number;
type NumericType = number | boolean;

type UniversalType = CombinableType & NumericType;