const db = require('../../db.js');
import {authenticated} from './auth.js';

export const config = {
     api: {
          externalResolver: true,
     }
}

let info = {};
let q = '';

const serializeSingle = (body) => {
     return body.replace("'", "&#39;");
}

const checkUserExists = (arr, uid) => {
     for (let i = 0; i < arr.length; i++) {
          if (arr[i].uid == uid) {
               return true
          }
     }
     return false
}

async function handler(req, res, decoded) {
     switch(req.method) {
          case 'GET':
               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on GET request to user.js");
                         res.status(202).end(`Could not connect to the database...`);
                         return;
                    }
                    
                    if (!req.query.tid || typeof req.query.tid == 'undefined') {
                         res.setHeader("Content-Type", "text/html");
                         res.status(202).end(`No ticket has been defined!`);
                         return;
                    }

                    let tid = req.query.tid;

                    q = db.buildQuery("select", {
                         db: "comments",
                         selection: [
                              "comments.*",
                              "concat(users.fname, ' ', users.lname) as creatorName",
                              "users.img_url"
                         ],
                         join: [
                              {
                                   db: "users",
                                   on: {
                                        "comments.creator": "users.uid"
                                   }
                              }
                         ],
                         where: {
                              "comments.ticket": tid
                         },
                         groupBy: "comments.updated_at"
                    })
                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query to the database on GET request to user.js:");
                              db.printError(err);
                              res.status(202).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         //console.log(rows);

                         res.status(200).json(rows);
                    });
               });
               break;
          case 'POST':
               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on GET request to user.js");
                         res.status(202).end(`Could not connect to the database...`);
                         return;
                    }
                    
                    if (!req.query.tid || typeof req.query.tid == 'undefined') {
                         res.setHeader("Content-Type", "text/html");
                         res.status(202).end(`No ticket has been defined!`);
                         return;
                    }

                    if (!req.body.comment || typeof req.body.comment == 'undefined') {
                         res.setHeader("Content-Type", "text/html");
                         res.status(202).end(`No ticket has been defined!`);
                         return;
                    }

                    let tid = req.query.tid;

                    q = db.buildQuery("insert", {
                         db: "comments",
                         columns: [
                              "comment",
                              "creator",
                              "ticket"
                         ],
                         values: [
                              serializeSingle(req.body.comment),
                              decoded.uid,
                              tid
                         ]
                    })

                    console.log(q);

                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query to the database on GET request to user.js:");
                              db.printError(err);
                              res.status(202).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         //console.log(rows);

                         res.status(200).end();
                    });
               });
               break;
          default:
               res.setHeader('Allow', ['GET', 'POST']);
               res.status(405).end(`Method ${req.method} Not Allowed`);
               break;
     }
}

export default authenticated(handler);