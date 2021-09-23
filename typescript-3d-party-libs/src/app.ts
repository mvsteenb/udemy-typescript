// import _ from 'lodash';
// console.log(_.shuffle([1, 2, 3]));

// declare var GLOBAL: string;
// console.log(GLOBAL);

import {Product} from '../product.model';
import 'reflect-metadata';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';

'class-transformer'

const products = [
    { title: 'A carpet', price: 29.99 },
    { title: 'A book', price: 10.99 }
];
const p1 = new Product('A book', 12.99);
console.log(p1.getInformation());

const newProd = new Product('', -5);
validate(newProd).then(errors => {
    if (errors.length > 0) {
        console.log('VALIDATION ERRORS !')
        console.log(errors);
    }
    else {
        console.log(newProd);
    }
});


/*const loadedProducts = products.map(p => {
    return new Product(p.title, p.price);
});
for (const prod of loadedProducts) {
    console.log(prod.getInformation());
}*/

// using class-transformer
const loadedProducts = plainToClass(Product, products);
for (const prod of loadedProducts) {
    console.log(prod.getInformation());
}