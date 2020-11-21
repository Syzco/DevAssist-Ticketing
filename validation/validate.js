const PATH_TABLE_PREFIX = "/var/www/database.proj/validation/tables/"
const fs = require('fs')

const validate = new Object();
validate.user = new Object();

const PATH_TABLE_USER = PATH_TABLE_PREFIX + "users.json";
const PATH_TABLE_PROJECT = PATH_TABLE_PREFIX + "projects.json";
const PATH_TABLE_RELATIONSHIP = PATH_TABLE_PREFIX + "relationships.json";
const PATH_TABLE_BUG = PATH_TABLE_PREFIX + "bugs.json";
const PATH_TABLE_COMMENT = PATH_TABLE_PREFIX + "comments.json";

validate.user.email = (email) => {
     if (!email.match(/@[a-zA-Z0-9]*.com\b/)) {
          return false;
     }
     return true;
}

validate.user.insert = (data) => {
     return new Promise((resolve, reject) => {
          //Validate all information was provided.
          if (typeof data == 'undefined') {
               reject(`The data is not defined.`);
               return false;
          }
          if (typeof data.db == 'undefined') {
               reject(`The data.db is not defined.`);
               return false;
          }
          if (typeof data.columns == 'undefined') {
               reject(`The data.columns is not defined.`);
               return false;
          }
          if (typeof data.values == 'undefined') {
               reject(`The data.values is not defined.`);
               return false
          }

          //Read file structure and parse.
          let raw = fs.readFileSync(PATH_TABLE_USER);     
          let format = JSON.parse(raw);

          //Validate table name.
          if (data.db != format.name) {
               reject(`The table name is not correct.`);
               return false;
          }
          
          //Validate columns and types of values.
          let actualKeys = [];
          let keys = Object.keys(format.columns);
          for (let i = 0; i < keys.length; i++) {
               if (format.columns[keys[i]].required == false) {
                    continue;
               }

               actualKeys.push(keys[i]);
          };

          data.columns.forEach((k, i) => {
               //Column validation.
               if (!actualKeys.includes(k)) {
                    reject(`The key '${k}' is not a valid column.`);
                    return false;
               }

               //Value validation.
               if (typeof data.values[i] != format.columns[k].type) {
                    reject(`The value '${data.values[i]}' is not a valid type.`);
                    return false;
               }

               //Validate email.
               if (k == 'email') {
                    if (!validate.user.email(data.values[i])) {
                         reject("The user's email did not pass validation.");
                         return false;
                    }
               }
          });

          resolve(true);
          return true;
     });
}

validate.user.query = (data) => {
     return new Promise((resolve, reject) => {
          //Read file structure and parse.
          let raw = fs.readFileSync(PATH_TABLE_USER);     
          let format = JSON.parse(raw);

          //Validate table name.
          if (data.db != format.name) {
               reject(`The table name is not correct.`);
               return false;
          }

          //Generate columns from file.
          let actualKeys = [];
          let keys = Object.keys(format.columns);
          for (let i = 0; i < keys.length; i++) {
               actualKeys.push(keys[i]);
          }

          //Check validity of columns.
          for (col in data.query) {
               if (!actualKeys.includes(col)) {
                    reject(`The key '${col}' is not a valid column.`);
                    return false;
               }
          }

          resolve(true);
          return true;
     });
}

validate.user.signUp = (data) => {
     return new Promise((resolve, reject) => {
          resolve(true);
     });
}

validate.userValidation = async (type, data) => {
     try {
          switch(type) {
               case 'insert': 
                   let insert = await validate.user.insert(data);
                   return insert;
                   break;
               case 'query':
                    let query = await validate.user.query(data);
                    return query;
                    break;
               default:
                    throw "No type was used when calliing userValidation().";
          }
     } catch (err) {
          return err;
     }
}

module.exports = validate;