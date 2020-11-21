const db = require('../../db.js');
const validate = require('../../validation/validate.js');
import { hash } from 'bcrypt';

export const config = {
     api: {
          externalResolver: true,
     }
}

let info = {};
let q = '';

async function handler(req, res) {
     res.setHeader('Content-Type', 'application/json')
     switch (req.method) {
          case 'POST':
               info = {};
               info.columns = [];
               info.values = [];
               
               info.db = 'users';

               let passKey = 0;

               let bodyKeys = Object.keys(req.body);
               for (let i = 0; i < bodyKeys.length; i++) {
                    if (bodyKeys[i] == 'db') {
                         continue;
                    }

                    if (bodyKeys[i] == 'pass') {
                         passKey = info.values.length;
                    }

                    info.columns.push(bodyKeys[i]);
                    info.values.push(req.body[bodyKeys[i]]);
               };

               if (typeof req.body.usergroup == 'undefined') {
                    info.columns.push("usergroup");
                    info.values.push(1);
               }

               let userValidation = await validate.userValidation('insert', info);           
               if (userValidation != true) {
                    res.status(202).end(`Request did not pass validation:\n${userValidation}`);
                    return;
               }

               hash(info.values[passKey], 10, (err, pass) => {
                    if (err) {
                         console.log(err);
                         res.status(202).end(`Could not hash password.`);
                         return;
                    }

                    info.values[passKey] = pass;

                    //console.log(info);

                    q = db.buildQuery('insert', info);

                    //console.log("\n" + q + "\n\n");

                    db.getConnection((err, conn) => {
                         if (err) {
                              db.printError("Could not connect to the database on POST request to user.js");
                              res.status(202).end(`Could not connect to the database...`);
                              return;
                         }

                         conn.query(q, (err, rows, fields) => {
                              if (err) {
                                   db.printError("Could not submit query to the database on POST request to user.js:");
                                   db.printError(err);
                                   res.status(202).end("Error submitting query to the database...\n" + err);
                                   return;
                              }
                              
                              res.status(200).json({
                                   query: q,
                                   result: rows
                              });
                         });
                    }); 
               });
              break;
          default:
               res.setHeader('Allow', ['POST']);
               res.status(405).end(`Method ${req.method} Not Allowed`);
               break;
     }
}

export default handler;