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
     //res.setHeader('Content-Type', 'application/json')
     switch (req.method) {
          case 'GET':
               if (!req.cookies.auth) {
                    res.status(202).end("No current cookies. Cannot process the request.");
                    return;
               }

               q = db.buildQuery('update', {
                    db: "users",
                    val: {
                         login_cookie: ""
                    },
                    where: {
                         login_cookie: req.cookies.auth
                    }
               });

               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on GET request to sighout.js");
                         res.status(202).end(`Could not connect to the database...`);
                         return;
                    }

                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query to the database on GET request to sighout.js:");
                              db.printError(err);
                              res.status(202).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         //No acccounts found.
                         if (rows.length < 1) {
                              res.status(202).end("There are no accounts associated to that cookie.");
                              return;
                         }

                         res.setHeader('Set-Cookie', cookie.serialize('auth', '', {
                              httpOnly: true,
                              secure: process.env.NODE_ENV !== 'development',
                              sameSite: 'strict',
                              maxAge: 0,
                              path: '/'
                         }));
                         res.writeHead(302, {
                              Location: '/'
                         });
                         res.end();
                    });
               });
               break;
          default:
               res.setHeader('Allow', ['GET']);
               res.status(405).end(`Method ${req.method} Not Allowed`);
               break;
     }
}

export default handler;