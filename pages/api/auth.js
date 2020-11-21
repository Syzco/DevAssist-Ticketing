const db = require('../../db.js')
import {verify} from 'jsonwebtoken';

export const config = {
     api: {
          externalResolver: true,
     }
}

require('dotenv').config();

export const authenticated = (fn) => (req, res) => {
     if (!req.cookies.auth) {
          res.setHeader('Content-Type', 'text/html');
          res.status(401).end("Sorry, you are not authenticated.");
          return;
     }
     
     verify(req.cookies.auth, process.env.JWT_SECRET, (err, decoded) => {
          if (!err && decoded) {
               let q = db.buildQuery('select', {
                    db: "users",
                    selection: [
                         "login_cookie"
                    ],
                    where: {
                         login_cookie: req.cookies.auth
                    }
               })

               //console.log(q);

               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on GET request to auth.js");
                         res.status(202).end(`Could not connect to the database...`);
                         return;
                    }

                    conn.query(q, async (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query to the database on GET request to auth.js:");
                              db.printError(err);
                              res.status(202).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         if (rows.length < 1) {
                              res.status(401).end("Sorry, you are not authenticated.");
                              return;
                         }
                         
                         return await fn(req, res, decoded);
                    });
               });
          } else {
               res.status(401).end("Sorry, you are not authenticated.");
          }
     });
}

async function handler(req, res) {
     switch (req.method) {
          //Check user cookie.
          case 'GET':
               let q = db.buildQuery('select', {
                    db: "users",
                    selection: [
                         "uid",
                         "email",
                         "fname",
                         "lname",
                         "usergroup",
                         "img_url"
                    ],
                    where: {
                         login_cookie: req.cookies.auth
                    }
               })

               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on GET request to auth.js");
                         res.status(202).end(`Could not connect to the database...`);
                         return;
                    }

                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query to the database on GET request to auth.js:");
                              db.printError(err);
                              res.status(202).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         if (rows.length < 1) {
                              res.status(401).end("No users matching the login_cookie of " + req.cookies.auth);
                              return;
                         }     
                         res.setHeader('Content-Type', 'application/json');
                         res.status(200).json(rows[0]);
                    });
               });
               break;
          default:
               res.setHeader('Allow', ['GET']);
               res.status(405).end(`Method ${req.method} Not Allowed`);
               break;
     }
}

export default authenticated(handler);