import {authenticated} from '../auth.js';
const db = require('../../../db.js');
let q = ''

export const config = {
     api: {
          externalResolver: true,
     }
}

function handler(req, res, decoded) {
     const {
          query: { uid },
     } = req

     switch(req.method) {
          case 'PUT':
               //console.log(decoded);
               if (uid != decoded.uid && decoded.usergroup != "admin") {
                    res.setHeader('Content-Type', 'text/html');
                    res.status(401).end("Sorry, you are not authenticated.");
                    return;
               }

               if (req.body.pass) {
                    delete req.body.pass;
                    res.setHeader('Content-Type', 'text/html');
                    res.status(500).end("Sorry, bud.");
                    return;
               }

               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on POST request to user/[uid].js");
                         res.status(400).end(`Could not connect to the database...`);
                         return;
                    }

                    q = db.buildQuery("update", {
                         db: "users",
                         val: {
                              ...req.body
                         },
                         where: {
                              uid: uid
                         }
                    });
     
                    //console.log(q);

                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query for user update on POST request to user/[uid].js:");
                              db.printError(err);
                              res.status(400).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         res.status(200).end();
                    });
               });
               break;
          case 'GET':
               if (uid != decoded.uid && decoded.usergroup != "admin") {
                    res.setHeader('Content-Type', 'text/html');
                    res.status(401).end("Sorry, you are not authenticated.");
                    return;
               }

               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on POST request to user/[uid].js");
                         res.status(400).end(`Could not connect to the database...`);
                         return;
                    }

                    q = db.buildQuery("select", {
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
                              uid: uid
                         }
                    });
     
                    //console.log(q);

                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query for user update on POST request to user/[uid].js:");
                              db.printError(err);
                              res.status(400).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         if (rows.length < 1) {
                              res.status(400).end("Query came up empty.")
                              return;
                         }
                         res.status(200).json(rows[0]);
                         res.end();
                    });
               });
               break;
          default:
               res.setHeader('Allow', ['PUT', 'GET']);
               res.status(405).end(`Method ${req.method} Not Allowed`);
               break;
     }
}

export default authenticated(handler);