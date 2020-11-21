const db = require('../../db.js');
const validate = require('../../validation/validate.js');
import {authenticated} from './auth.js';

export const config = {
     api: {
          externalResolver: true,
     }
}

let info = {};
let q = '';

async function handler(req, res, decoded) {
     res.setHeader('Content-Type', 'application/json')
     switch(req.method) {
          case 'GET':
               if (decoded.usergroup != "admin") {
                    res.setHeader('Content-Type', 'text/html');
                    res.status(401).end("Sorry, you are not authenticated.");
                    return
               }

               info = {};
               info.selection = [
                    "uid",
                    "email",
                    "fname",
                    "lname",
                    "img_url",
                    "usergroup"
               ];
               info.where = req.query;

               info.db = 'users';
               
               if (Object.keys(req.query).length != 0) {
                    let userQueryValidation = await validate.userValidation('query', {query: req.query, db: info.db});           
                    if (userQueryValidation != true) {
                         res.status(202).end(`Request did not pass validation:\n${userQueryValidation}`);
                         return;
                    }
               }

               if (Object.keys(req.body).length != 0) {
                    for (col in req.body) {
                         if (req.body[col] == false) continue;

                         info.selection.push(col);
                    }
               }

               q = db.buildQuery('select', info);

               //console.log("\n" + q + "\n\n");

               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on GET request to user.js");
                         res.status(202).end(`Could not connect to the database...`);
                         return;
                    }

                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query to the database on GET request to user.js:");
                              db.printError(err);
                              res.status(202).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         res.status(200).json(rows);
                    });
               })
               break;
          default:
               res.setHeader('Allow', ['GET']);
               res.status(405).end(`Method ${req.method} Not Allowed`);
               break;
     }
}

export default authenticated(handler);