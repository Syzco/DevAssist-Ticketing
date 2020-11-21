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
                    
                    if (!req.query.pid || typeof req.query.pid == 'undefined') {
                         res.setHeader("Content-Type", "text/html");
                         res.status(202).end(`No project has been defined!`);
                         return;
                    }

                    let pid = req.query.pid;

                    switch (decoded.usergroup) {
                         case 'user':
                              q = db.buildQuery("select", {
                                   db: "relationships",
                                   selection: [
                                        "uid"
                                   ],
                                   where: {
                                        "pid": pid
                                   }
                              })
                              conn.query(q, (err, rows, fields) => {
                                   if (err) {
                                        db.printError("Could not submit query to the database on GET request to user.js:");
                                        db.printError(err);
                                        res.status(202).end("Error submitting query to the database...\n" + err);
                                        return;
                                   }
          
                                   if (rows.lenth < 0 && !checkUserExists(rows, decoded.uid)) {
                                        res.status(400).end("Sorry, you are not apart of this project.")
                                   } else {
                                        q = db.buildQuery("select", {
                                             db: "tickets",
                                             selection: [
                                                  "tickets.tid",
                                                  "tickets.created_at",
                                                  "tickets.updated_at",
                                                  "tickets.title",
                                                  "tickets.description",
                                                  "tickets.creator",
                                                  "concat(users.fname, ' ', users.lname) as creatorName",
                                                  "users.img_url"
                                             ],
                                             join: [
                                                  {
                                                       db: "users",
                                                       on: {
                                                            "tickets.creator": "users.uid"
                                                       }
                                                  }
                                             ],
                                             where: {
                                                  "tickets.project": pid,
                                                  "creator": decoded.uid
                                             },
                                             groupBy: "tickets.updated_at"
                                        })
                                        conn.query(q, (err, rows, fields) => {
                                             if (err) {
                                                  db.printError("Could not submit query to the database on GET request to user.js:");
                                                  db.printError(err);
                                                  res.status(202).end("Error submitting query to the database...\n" + err);
                                                  return;
                                             }
                    
                                             res.status(200).json(rows);
                                        });
                                   }
                              });
                              break;
                         case 'dev':
                              q = db.buildQuery("select", {
                                   db: "projects",
                                   selection: [
                                        "author",
                                   ],
                                   where: {
                                        "pid": pid
                                   }
                              })

                              conn.query(q, (err, rows, fields) => {
                                   if (err) {
                                        db.printError("Could not submit query to the database on GET request to user.js:");
                                        db.printError(err);
                                        res.status(202).end("Error submitting query to the database...\n" + err);
                                        return;
                                   }
          
                                   if (rows[0].author == decoded.uid) {
                                        q = db.buildQuery("select", {
                                             db: "tickets",
                                             selection: [
                                                  "tickets.tid",
                                                  "tickets.created_at",
                                                  "tickets.updated_at",
                                                  "tickets.title",
                                                  "tickets.description",
                                                  "tickets.creator",
                                                  "concat(users.fname, ' ', users.lname) as creatorName",
                                                  "users.img_url"
                                             ],
                                             join: [
                                                  {
                                                       db: "users",
                                                       on: {
                                                            "tickets.creator": "users.uid"
                                                       }
                                                  }
                                             ],
                                             where: {
                                                  "tickets.project": pid
                                             },
                                             groupBy: "tickets.updated_at"
                                        })
                                        conn.query(q, (err, rows, fields) => {
                                             if (err) {
                                                  db.printError("Could not submit query to the database on GET request to user.js:");
                                                  db.printError(err);
                                                  res.status(202).end("Error submitting query to the database...\n" + err);
                                                  return;
                                             }
                    
                                             res.status(200).json(rows);
                                        });
                                   } else {
                                        q = db.buildQuery("select", {
                                             db: "relationships",
                                             selection: [
                                                  "uid"
                                             ],
                                             where: {
                                                  "pid": pid
                                             }
                                        })
                                        conn.query(q, (err, rows, fields) => {
                                             if (err) {
                                                  db.printError("Could not submit query to the database on GET request to user.js:");
                                                  db.printError(err);
                                                  res.status(202).end("Error submitting query to the database...\n" + err);
                                                  return;
                                             }
                    
                                             if (rows.lenth < 0 && !checkUserExists(rows, decoded.uid)) {
                                                  res.status(400).end("Sorry, you are not apart of this project.")
                                             } else {
                                                  q = db.buildQuery("select", {
                                                       db: "tickets",
                                                       selection: [
                                                            "tickets.tid",
                                                            "tickets.created_at",
                                                            "tickets.updated_at",
                                                            "tickets.title",
                                                            "tickets.description",
                                                            "tickets.creator",
                                                            "concat(users.fname, ' ', users.lname) as creatorName",
                                                            "users.img_url"
                                                       ],
                                                       join: [
                                                            {
                                                                 db: "users",
                                                                 on: {
                                                                      "tickets.creator": "users.uid"
                                                                 }
                                                            }
                                                       ],
                                                       where: {
                                                            "tickets.project": pid,
                                                            "creator": decoded.uid
                                                       },
                                                       groupBy: "tickets.updated_at"
                                                  })
                                                  conn.query(q, (err, rows, fields) => {
                                                       if (err) {
                                                            db.printError("Could not submit query to the database on GET request to user.js:");
                                                            db.printError(err);
                                                            res.status(202).end("Error submitting query to the database...\n" + err);
                                                            return;
                                                       }
                              
                                                       res.status(200).json(rows);
                                                  });
                                             }
                                        });
                                   }
                              });
                              break;
                         default:
                              q = db.buildQuery("select", {
                                   db: "tickets",
                                   selection: [
                                        "tickets.tid",
                                        "tickets.created_at",
                                        "tickets.updated_at",
                                        "tickets.title",
                                        "tickets.description",
                                        "tickets.creator",
                                        "concat(users.fname, ' ', users.lname) as creatorName",
                                        "users.img_url"
                                   ],
                                   join: [
                                        {
                                             db: "users",
                                             on: {
                                                  "tickets.creator": "users.uid"
                                             }
                                        }
                                   ],
                                   where: {
                                        "tickets.project": pid
                                   },
                                   groupBy: "tickets.updated_at"
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
                              break;
                    }
               })
               break;
          case 'POST':
               db.getConnection((err, conn) => {
                    if (err) {
                         db.printError("Could not connect to the database on GET request to user.js");
                         res.status(202).end(`Could not connect to the database...`);
                         return;
                    }
                    
                    if (!req.query.pid || typeof req.query.pid == 'undefined') {
                         res.setHeader("Content-Type", "text/html");
                         res.status(202).end(`No project has been defined!`);
                         return;
                    }

                    switch (decoded.usergroup) {
                         case 'user':
                              q = db.buildQuery("select", {
                                   db: "relationships",
                                   selection: [
                                        "rid"
                                   ],
                                   where: {
                                        pid: req.query.pid,
                                        uid: decoded.uid
                                   }
                              })

                              conn.query(q, (err, rows, fields) => {
                                   if (err) {
                                        db.printError("Could not submit query to the database on GET request to user.js:");
                                        db.printError(err);
                                        res.status(202).end("Error submitting query to the database...\n" + err);
                                        return;
                                   }
          
                                   if (rows.length > 0) {
                                        q = db.buildQuery("insert", {
                                             db: "tickets",
                                             columns: [
                                                  "title",
                                                  "description",
                                                  "creator",
                                                  "project"
                                             ],
                                             values: [
                                                  serializeSingle(req.body.title),
                                                  serializeSingle(req.body.description),
                                                  decoded.uid.toString(),
                                                  req.query.pid
                                             ]
                                        })
                                        conn.query(q, (err, rows, fields) => {
                                             if (err) {
                                                  db.printError("Could not submit query to the database on POST request to tickets.js:");
                                                  db.printError(err);
                                                  res.status(202).end("Error submitting query to the database...\n" + err);
                                                  return;
                                             }
                    
                                             res.status(200).end();
                                        });
                                   } else {
                                        res.setHeader("Content-Type", "text/html");
                                        res.status(400).end(`You are not authorized to create tickets you aren't apart of.`);
                                        return;
                                   }
                              });
                              break;
                         case 'dev':
                              q = db.buildQuery("select", {
                                   db: "projects",
                                   selection: [
                                        "author"
                                   ],
                                   where: {
                                        pid: req.query.pid,
                                        author: decoded.uid
                                   }
                              })

                              conn.query(q, (err, rows, fields) => {
                                   if (err) {
                                        db.printError("Could not submit query to the database on GET request to user.js:");
                                        db.printError(err);
                                        res.status(202).end("Error submitting query to the database...\n" + err);
                                        return;
                                   }
          
                                   if (rows.length > 0) {
                                        q = db.buildQuery("insert", {
                                             db: "tickets",
                                             columns: [
                                                  "title",
                                                  "description",
                                                  "creator",
                                                  "project"
                                             ],
                                             values: [
                                                  serializeSingle(req.body.title),
                                                  serializeSingle(req.body.description),
                                                  decoded.uid.toString(),
                                                  req.query.pid
                                             ]
                                        })
                                   } else {
                                        q = db.buildQuery("select", {
                                             db: "relationships",
                                             selection: [
                                                  "rid"
                                             ],
                                             where: {
                                                  pid: req.query.pid,
                                                  uid: decoded.uid
                                             }
                                        })
          
                                        conn.query(q, (err, rows, fields) => {
                                             if (err) {
                                                  db.printError("Could not submit query to the database on POST request to tickets.js:");
                                                  db.printError(err);
                                                  res.status(202).end("Error submitting query to the database...\n" + err);
                                                  return;
                                             }
                    
                                             if (rows.length > 0) {
                                                  q = db.buildQuery("insert", {
                                                       db: "tickets",
                                                       columns: [
                                                            "title",
                                                            "description",
                                                            "creator",
                                                            "project"
                                                       ],
                                                       values: [
                                                            serializeSingle(req.body.title),
                                                            serializeSingle(req.body.description),
                                                            decoded.uid.toString(),
                                                            req.query.pid
                                                       ]
                                                  })
                                                  conn.query(q, (err, rows, fields) => {
                                                       if (err) {
                                                            db.printError("Could not submit query to the database on POST request to tickets.js:");
                                                            db.printError(err);
                                                            res.status(202).end("Error submitting query to the database...\n" + err);
                                                            return;
                                                       }
                              
                                                       res.status(200).end();
                                                  });
                                             } else {
                                                  res.setHeader("Content-Type", "text/html");
                                                  res.status(400).end(`You are not authorized to create tickets you don't own or aren't apart of.`);
                                                  return;
                                             }
                                        });
                                   }
                              });
                              break;
                         default:                              
                              q = db.buildQuery("insert", {
                                   db: "tickets",
                                   columns: [
                                        "title",
                                        "description",
                                        "creator",
                                        "project"
                                   ],
                                   values: [
                                        serializeSingle(req.body.title),
                                        serializeSingle(req.body.description),
                                        decoded.uid.toString(),
                                        req.query.pid
                                   ]
                              })
                              conn.query(q, (err, rows, fields) => {
                                   if (err) {
                                        db.printError("Could not submit query to the database on POST request to tickets.js:");
                                        db.printError(err);
                                        res.status(202).end("Error submitting query to the database...\n" + err);
                                        return;
                                   }
          
                                   res.status(200).end();
                              });
                              break;
                    }
               })
               break;
          default:
               res.setHeader('Allow', ['GET', 'POST']);
               res.status(405).end(`Method ${req.method} Not Allowed`);
               break;
     }
}

export default authenticated(handler);