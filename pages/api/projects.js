import {authenticated} from './auth.js';
const db = require('../../db.js');
let q = ''

export const config = {
     api: {
          externalResolver: true,
     }
}

function handler(req, res, decoded) {
     switch(req.method) {
          case 'POST':
               if (decoded.usergroup != "dev" && decoded.usergroup != "admin") {
                    res.setHeader('Content-Type', 'text/html');
                    res.status(401).end("Sorry, you are not authenticated. Usergroup is not aligned.");
                    return;
               }

               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on POST request to project.js");
                         res.status(202).end(`Could not connect to the database...`);
                         return;
                    }

                    let info = {
                         db: "projects",
                         columns: Object.keys(req.body),
                         values: Object.values(req.body)
                    }

                    info.columns.push("author");
                    info.values.push(decoded.uid);

                    q = db.buildQuery("insert", info);
     
                    //console.log(q);

                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query for user update on POST request to project.js:");
                              db.printError(err);
                              res.status(202).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         res.status(200).end();
                    });
               });
               break;
          case 'GET':
               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on POST request to project.js");
                         res.status(202).end(`Could not connect to the database...`);
                         return;
                    }
                    
                    let info = [
                         {
                              type: "select",
                              db: "projects",
                              selection: [
                                   "projects.pid",
                                   "projects.created_at",
                                   "projects.updated_at",
                                   "projects.title",
                                   "projects.description",
                                   "projects.img_url",
                                   "concat(users.fname, ' ', users.lname) as author"
                              ],
                              join: [
                                   {
                                        db: "users",
                                        on: {
                                             "projects.author": "users.uid"
                                        }
                                   }
                              ],
                              where: {
                                   author: decoded.uid
                              }
                         },
                         {
                              type: "select",
                              db: "relationships",
                              selection: [
                                   "projects.pid",
                                   "projects.created_at",
                                   "projects.updated_at",
                                   "projects.title",
                                   "projects.description",
                                   "projects.img_url",
                                   "concat(users.fname, ' ', users.lname) as author"
                              ],
                              join: [
                                   {
                                        db: "projects",
                                        on: {
                                             "relationships.pid": "projects.pid"
                                        }
                                   },
                                   {
                                        db: "users",
                                        on: {
                                             "projects.author": "users.uid"
                                        }
                                   }
                              ],
                              where: {
                                   "relationships.uid": decoded.uid
                              }
                         }
                    ]

                    q = db.buildMultiQuery(info);
     
                    //console.log(q);

                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query for user update on GET request to project.js:");
                              db.printError(err);
                              res.status(202).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         res.status(200).json(rows);
                         res.end();
                    });
               });
               break;
          default:
               res.setHeader('Allow', ['POST', 'GET']);
               res.status(405).end(`Method ${req.method} Not Allowed`);
               break;
     }
}

export default authenticated(handler);