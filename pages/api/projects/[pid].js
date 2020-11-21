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
          query: { pid, uid },
          method
     } = req

     const serialize = (body) => {
          Object.keys(body).map((key) => {
               body[key] = body[key].replace("'", "&#39;");
          })
          return body
     }

     switch(method) {
          case 'PUT':
               if (decoded.usergroup != "admin" && decoded.usergroup != "dev") {
                    res.setHeader('Content-Type', 'text/html');
                    res.status(401).end("Sorry, you are not authenticated.");
                    return;
               }

               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on PUT request to user/[uid].js");
                         res.status(400).end(`Could not connect to the database...`);
                         return;
                    }

                    switch (req.body.type) {
                         case 'info':
                              delete req.body.type
                              q = db.buildQuery("update", {
                                   db: "projects",
                                   val: {
                                        ...serialize(req.body)
                                   },
                                   where: {
                                        pid: pid
                                   }
                              });
                              break;
                         case 'user':
                              q = db.buildQuery("select", {
                                   db: "relationships",
                                   selection: [
                                        "pid",
                                        "uid"
                                   ],
                                   where: {
                                        uid: "(" + db.buildQuery("select", {
                                             db: "users",
                                             selection: [
                                                  "uid"
                                             ],
                                             where: {
                                                  email: req.body.email
                                             }
                                        }) + ")",
                                        pid: pid
                                   }
                              })

                              conn.query(q, (err, rows, fields) => {
                                   if (err) {
                                        db.printError("Could not submit query for user update on PUT request to user/[uid].js:");
                                        db.printError(err);
                                        res.status(400).end("Error submitting query to the database...\n" + err);
                                        return;
                                   }

                                   if (rows.length < 1) {
                                        q = db.buildQuery("insert", {
                                             db: "relationships",
                                             columns: [
                                                  "pid",
                                                  "uid"
                                             ],
                                             values: [
                                                  pid,
                                                  "(" + db.buildQuery("select", {
                                                       db: "users",
                                                       selection: [
                                                            "uid"
                                                       ],
                                                       where: {
                                                            email: req.body.email
                                                       }
                                                  }) + ")"
                                             ]
                                        })
                                   } else {
                                        res.status(202).json({
                                             title: "User Already Exists",
                                             message: "The user already exists on this project. Please try again..."
                                        })
                                        res.end();
                                        return;
                                   }
                              })
                              break;
                         default:
                              res.setHeader("Content-Type", "text/html")
                              res.status(400).end("Need to specify a type!")
                              break;
                    }

                    //console.log(q);

                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              //console.log(err.code);
                              if (err.code == "ER_BAD_NULL_ERROR") {
                                   res.status(202).json({
                                        title: "User Does Not Exist",
                                        message: "No users with that email exist. Please try again..."
                                   })
                                   res.end();
                                   return;
                              }

                              db.printError("Could not submit query for user update on PUT request to user/[uid].js:");
                              db.printError(err);
                              res.status(400).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         res.status(200).end();
                    });
               });
               break;
          case 'GET':
               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on GET request to project/[pid].js");
                         res.status(400).end(`Could not connect to the database...`);
                         return;
                    }

                    let info = {
                         db: "projects",
                         selection: [
                              "projects.pid",
                              "projects.created_at",
                              "projects.updated_at",
                              "projects.title",
                              "projects.description",
                              "projects.img_url",
                              "projects.author",
                              "concat(users.fname, ' ', users.lname) as authorName"
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
                              pid: pid
                         }
                    }

                    q = db.buildQuery("select", info)
     
                    //console.log(q);

                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query for user update on GET request to project/[pid].js:");
                              db.printError(err);
                              res.setHeader("Content-Type", "text/html")
                              res.status(400).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         if (rows.length < 1) {
                              res.setHeader("Content-Type", "text/html")
                              res.status(400).end("Query came up empty.")
                              return;
                         }

                         q = db.buildQuery("select", {
                              db: "relationships",
                              selection: [
                                   "users.uid",
                                   "users.email",
                                   "concat(users.fname, ' ', users.lname) as uname",
                                   "users.img_url", 
                                   "users.usergroup"
                              ],
                              join: [
                                   {
                                        db: "users",
                                        on: {
                                             "relationships.uid": "users.uid"
                                        }
                                   }
                              ],
                              where: {
                                   pid: pid
                              }
                         })

                         conn.query(q, (err, secondRows, fields) => {
                              if (err) {
                                   db.printError("Could not submit query for user update on GET request to project/[pid].js:");
                                   db.printError(err);
                                   res.setHeader("Content-Type", "text/html")
                                   res.status(400).end("Error submitting query to the database...\n" + err);
                                   return;
                              }

                              const checkUserExists = (arr, uid) => {
                                   for (let i = 0; i < arr.length; i++) {
                                        if (arr[i].uid == uid) {
                                             return true
                                        }
                                   }
                                   return false
                              }

                              if (decoded.usergroup != "admin" && decoded.uid != rows[0].author && !checkUserExists(secondRows, decoded.uid)) {
                                   res.setHeader("Content-Type", "text/html")
                                   res.status(400).end("You do not appear to have ownership of this project and are not attached!")
                                   return;
                              }

                              res.setHeader("Content-Type", "application/json")
                              res.status(200).json({
                                   ...rows[0],
                                   users: secondRows
                              });
                              res.end();
                         });
                    });
               });
               break;
          case 'DELETE':
               if (decoded.usergroup != "admin" && decoded.usergroup != "dev") {
                    res.setHeader('Content-Type', 'text/html');
                    res.status(401).end("Sorry, you are not authenticated.");
                    return;
               }

               if (typeof uid == 'undefined') {
                    res.setHeader('Content-Type', 'text/html');
                    res.status(401).end("Request was invalid. Please double check...");
                    return;
               }

               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on DELETE request to project/[pid].js");
                         res.status(400).end(`Could not connect to the database...`);
                         return;
                    }

                    let info = {
                         db: "relationships",
                         where: {
                              uid: uid
                         }
                    }

                    q = db.buildQuery("delete", info)
     
                    //console.log(q);

                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              db.printError("Could not submit query for user update on DELETE request to project/[pid].js:");
                              db.printError(err);
                              res.setHeader("Content-Type", "text/html")
                              res.status(400).end("Error submitting query to the database...\n" + err);
                              return;
                         }

                         res.setHeader('Content-Type', 'text/html');
                         res.status(200).end("");
                    });
               });
               break;
          default:
               res.setHeader('Allow', ['PUT', 'GET', 'DELETE']);
               res.status(405).end(`Method ${req.method} Not Allowed`);
               break;
     }
}

export default authenticated(handler);