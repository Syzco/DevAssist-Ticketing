const db = require('../../db.js');
import {compare} from 'bcrypt';
import {sign} from 'jsonwebtoken';
import cookie from 'cookie';
let q = '';

require('dotenv').config();

export const config = {
     api: {
          externalResolver: true,
     }
}

async function handler(req, res) {
     res.setHeader('Content-Type', 'application/json')
     switch (req.method) {
          case 'POST':
               q = db.buildQuery('select', {
                    db: "users",
                    selection: [
                         "uid",
                         "email",
                         "pass",
                         "fname",
                         "lname",
                         "usergroup"
                    ],
                    where: {
                         email: req.body.email
                    }
               });

               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on POST request to login.js");
                         res.status(202).end(`Could not connect to the database...`);
                         return;
                    }

                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query to the database on POST request to login.js:");
                              db.printError(err);
                              res.status(202).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         //No acccounts found.
                         if (rows.length < 1) {
                              res.status(202).end("There are no accounts associated to that email.");
                              return;
                         }

                         compare(req.body.pass, rows[0].pass, (err, result) => {
                              if (!err && result) {
                                   const claims = {uid: rows[0].uid, email: rows[0].email, fname: rows[0].fname, lname: rows[0].lname, usergroup: rows[0].usergroup};
                                   const jwt = sign(claims, process.env.JWT_SECRET, {expiresIn: '1h'})

                                   q = db.buildQuery('update', {
                                        db: "users",
                                        val: {
                                             login_cookie: jwt
                                        },
                                        where: {
                                             uid: rows[0].uid
                                        }
                                   });

                                   //console.log(q);

                                   conn.query(q, (err, rows, fields) => {
                                        if (err) {
                                             db.printError("Could not submit query for login cookie on POST request to login.js:");
                                             db.printError(err);
                                             res.status(202).end("Error submitting query to the database...\n" + err);
                                             return;
                                        }

                                        res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
                                             httpOnly: true,
                                             secure: process.env.NODE_ENV !== 'development',
                                             sameSite: 'strict',
                                             maxAge: 3600,
                                             path: '/'
                                        }));

                                        res.status(200).end();
                                   });
                              } else {
                                   //console.log(err);
                                   res.status(202).end("Error processing your request. Please try again.");
                                   return;
                              }
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