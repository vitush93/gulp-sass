import test from './test-module';
test();

let template = require('../templates/test.hbs');
let html = template({name: 'John'});

console.log(html);