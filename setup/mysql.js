const db = require('../db.js');

const devAssistDataTables = [
     //User table information.
     {
          name: "users",
          columns: [
               {name: "uid", type: "INT", extras: "NOT NULL AUTO_INCREMENT"},
               {name: "email", type: "VARCHAR", size: "255", extras: "NOT NULL UNIQUE"},
               {name: "fname", type: "VARCHAR", size: "255", extras: "NOT NULL"},
               {name: "lname", type: "VARCHAR", size: "255", extras: "NOT NULL"},
               {name: "pass", type: "TEXT", extras: "NOT NULL"},
               {name: "login_cookie", type: "TEXT"},
               {name: "img_url", type: "TEXT", extras: "DEFAULT '/assets/img-temp/profile.jpg' NOT NULL"},
               {name: "usergroup", type: "ENUM", options: ['"user"', '"dev"', '"admin"'], extras: "DEFAULT 'user' NOT NULL"}
          ],
          primaryKey: "uid"
     },

     //Projects table information.
     {
          name: "projects",
          columns: [
               {name: "pid", type: "INT", extras: "NOT NULL AUTO_INCREMENT"},
               {name: "created_at", type: "TIMESTAMP", extras: "NOT NULL DEFAULT NOW()"},
               {name: "updated_at", type: "TIMESTAMP", extras: "NOT NULL DEFAULT NOW() ON UPDATE NOW()"},
               {name: "title", type: "VARCHAR", size: "255", extras: "NOT NULL"},
               {name: "description", type: "TEXT"},
               {name: "img_url", type: "TEXT", extras: "DEFAULT '/assets/img-temp/profile.jpg' NOT NULL"},
               {name: "author", type: "INT", extras: "NOT NULL"}
          ],
          primaryKey: "pid",
          constraints: [
               {name: "fk_author_id", fk: "author", ref: "users", refKey: "uid"}
          ]
     },

     //Relationships table information.
     {
          name: "relationships",
          columns: [
               {name: "rid", type: "INT", extras: "NOT NULL AUTO_INCREMENT"},
               {name: "pid", type: "INT", extras: "NOT NULL"},
               {name: "uid", type: "INT", extras: "NOT NULL"}
          ],
          primaryKey: "rid",
          constraints: [
               {name: "fk_proj_id", fk: "pid", ref: "projects", refKey: "pid"},
               {name: "fk_user_id", fk: "uid", ref: "users", refKey: "uid"}
          ]
     },

     //Bugs table information.
     {
          name: "tickets",
          columns: [
               {name: "tid", type: "INT", extras: "NOT NULL AUTO_INCREMENT"},
               {name: "created_at", type: "TIMESTAMP", extras: "NOT NULL DEFAULT NOW()"},
               {name: "updated_at", type: "TIMESTAMP", extras: "NOT NULL DEFAULT NOW() ON UPDATE NOW()"},
               {name: "title", type: "VARCHAR", size: "255", extras: "NOT NULL"},
               {name: "description", type: "TEXT"},
               {name: "creator", type: "INT", extras: "NOT NULL"},
               {name: "project", type: "INT", extras: "NOT NULL"}
          ],
          primaryKey: "bid",
          constraints: [
               {name: "fk_creator_id", fk: "creator", ref: "users", refKey: "uid"},
               {name: "fk_bug_proj_id", fk: "project", ref: "projects", refKey: "pid"}
          ]
     },

     //Comments table information.
     {
          name: "comments",
          columns: [
               {name: "cid", type: "INT", extras: "NOT NULL AUTO_INCREMENT"},
               {name: "created_at", type: "TIMESTAMP", extras: "NOT NULL DEFAULT NOW()"},
               {name: "updated_at", type: "TIMESTAMP", extras: "NOT NULL DEFAULT NOW() ON UPDATE NOW()"},
               {name: "comment", type: "TEXT", extras: "NOT NULL"},
               {name: "creator", type: "INT", extras: "NOT NULL"},
               {name: "ticket", type: "INT", extras: "NOT NULL"}
          ],
          primaryKey: "cid",
          constraints: [
               {name: "fk_com_creator_id", fk: "creator", ref: "users", refKey: "uid"},
               {name: "fk_ticket_id", fk: "ticket", ref: "tickets", refKey: "tid"}
          ]
     }
];

module.exports =  async function() {
     return new Promise((resolve, reject) => {
          db.getConnection((err, conn) => {
               if (err) {
                    reject(err);
                    return;
               }

               devAssistDataTables.forEach((e, i) => {
                    //Build and print query.
                    let q = db.buildQuery('table', e);
                    //console.log(q + "\n\n");

                    //Execute query.
                    conn.query(q, (err, rows, fields) => {
                         if (err) {
                              reject(err);
                              return;
                         }

                         //db.print(rows);

                         //Release connection and exit on last item.
                         if (i == (devAssistDataTables.length-1)) {
                              conn.release();
                              resolve(rows);
                         }
                    });
               }, this);
          });
     });
}