const AppError = require("./AppError")

const isEmpty = value => {
  if (!value || value?.length === 0) {
    return true;
  }
  return false;
}

const validateText = value => {
  isEmpty
}

const validateNumber = value => {

}

const validateArray = value => {

}

const validateObject = value => {
  
}

const validations = {
  text: validateText,
  number: validateNumber,
  array: validateArray,
  object: validateObject,
};

const validateEntries = (entries) => {
  Object.keys(entries).map(entry => {
    if (!entries[entry] || entries[entry]?.length === 0) {
      throw new AppError(`Field ${entry} cant be empty!`, 400);
    }
  })
}

module.exports = validateEntries;