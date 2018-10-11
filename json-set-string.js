#!/usr/bin/env node

var fs = require('fs');

const jsonFilePath = process.argv[2];
const fieldPath = process.argv[3].split('.');
const newValue = process.argv[4];

const setField = (obj, fieldPath, value) => {
  if(fieldPath.length > 1) {
    setField(obj[fieldPath[0]], fieldPath.slice(1), value);
  }
  else {
    obj[fieldPath[0]] = value;
  }
};

fs.readFile(jsonFilePath, {encoding: 'utf8'}, (err, data) => {
  if(err) {
    console.error('Could not open ' + jsonFilePath);
    process.exit(1);
  }
  else {
    let package;
    try {
      package = JSON.parse(data);
    }
    catch(e) {
      console.error('Could not parse JSON in ' + jsonFilePath);
      process.exit(1);
    }
    setField(package, fieldPath, newValue);
    const outString = JSON.stringify(package, null, 2);
    fs.writeFile(jsonFilePath, outString, {encoding: 'utf8'}, err => {
      if(err) {
        console.error('Could not write to ' + jsonFilePath);
        process.exit(1);
      }
      else {
        console.log(`Set ${jsonFilePath}:${fieldPath.join('.')} = ${newValue}`);
      }
    });
  }
});