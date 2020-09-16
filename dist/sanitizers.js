import validator from 'validator';
const boolean = (value) => validator.toBoolean(string(value));
const date = (value) => validator.toDate(value);
const float = (value) => validator.toFloat(string(value));
const integer = (value) => validator.toInt(string(value));
const string = (value) => validator.toString(value);
export { boolean, date, float, integer, string, };
