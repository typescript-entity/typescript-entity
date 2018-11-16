import * as validator from 'validator';

const boolean = (value: any) => validator.toBoolean(string(value));
const date = (value: any) => validator.toDate(value);
const float = (value: any) => validator.toFloat(string(value));
const integer = (value: any) => validator.toInt(string(value));
const string = (value: any) => validator.toString(value);

export {
  boolean,
  date,
  float,
  integer,
  string,
};
