type AdminType = {
  name: string;
  privileges: string[];
};

type EmployeeType = {
  name: string;
  startDate: Date;
};

type ElevatedEmployeeType = Admin & Employee;

const emp: ElevatedEmployee = {
  name: 'Mario',
  privileges: ['create-server'],
  startDate: new Date()
}

type CombinableT = string | number;
type NumericT = number | boolean;

type UniversalT = CombinableT & NumericT;