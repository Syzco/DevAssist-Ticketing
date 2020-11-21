const API_USER_URL = 'http://localhost:3000/api/signup';
const axios = require('axios');
const validate = require('../validation/validate.js');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function promptEmail() {
     return new Promise((resolve, reject) => {
          rl.question("Please enter the admin email: ", async function(email) {
               if (validate.user.email(email)) {
                   resolve(email);
                   return;
               } else {
                    console.log("\nERROR: You have entered an invalid email address...\nYour email address should look something like this: username@website.com");
                    console.log("Please try again...\n");
                    resolve(promptEmail());
               }
          });
     });
}

async function promptPassword() {
     return new Promise((resolve, reject) => {
          rl.question("Please enter the admin password: ", function(password) {
               resolve(password);
          });
     });
}

async function promptFirstName() {
     return new Promise((resolve, reject) => {
          rl.question("Please enter the admin first name: ", function(fname) {
               resolve(fname);
          });
     });
}

async function promptLastName() {
     return new Promise((resolve, reject) => {
          rl.question("Please enter the admin last name: ", function(lname) {
               resolve(lname);
          });
     });
}

async function promptAdminInformation() {
     return new Promise(async (resolve, reject) => {
          try {
               let email = await promptEmail();
               let password = await promptPassword();
               let fname = await promptFirstName();
               let lname = await promptLastName();

               rl.close();
               resolve([email, password, fname, lname]);
          } catch (err) {
               reject(err);
          }
     })
}

module.exports = async function() {
     return new Promise(async (resolve, reject) => {
          try {
               let [email, password, fname, lname] = await promptAdminInformation();

               let data = {
                    db: 'users',
                    fname: fname.toLowerCase(),
                    lname: lname.toLowerCase(),
                    email: email.toLowerCase(),
                    pass: password,
                    usergroup: 3
               }
                  
               axios.post(API_USER_URL, data).then(response => {
                    resolve(response.data);
               }).catch((err) => {
                    reject(err.response.data);
               });   
          } catch (err) {
               reject(err);
          }
     });
}