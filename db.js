const mysql = require('mysql');
const prefix = "DB";

require('dotenv').config();

const conn = mysql.createPool({
     connectionLimit: 10,
     host: process.env.DB_HOST, 
     user: process.env.DB_USER, 
     password: process.env.DB_PWD,
     database: process.env.DB_NAME
})

conn.print = (msg) => {
     if (typeof msg == 'object') {
          console.log("[" + prefix + "] :");
          console.log(msg)
     } else {
          console.log("[" + prefix + "]" + " " + msg);
     }
}

conn.printError = (msg) => {
     console.log("[" + prefix + " - ERROR]" + " " + msg);
}

//Build where query.
conn.buildWhereQuery = (info) => {
     let query = 'WHERE ';
          let keys = Object.keys(info);
          keys.forEach((key, i) => {
               if (typeof info[key] == 'number' || info[key].startsWith("(") && info[key].endsWith(")")) {
                    query += `${key}=${info[key]}`;
               } else {
                    query += `${key}='${info[key]}'`;
               }

               if (i < keys.length-1) {
                    query += ' AND ';
               }
          });

     return query;
}

//Build update query.
conn.buildUpdateQuery = (info) => {
     let query = `UPDATE ${info.db} SET `;
          let cols = Object.keys(info.val);
          cols.forEach((key, i) => {
               query += `${key} = '${info.val[key]}'`;
               query += ((cols.length-1 == i) ? ' ' : ', ');
          });
          
          query += conn.buildWhereQuery(info.where);
     return query;
}

//Build select query.
conn.buildSelectQuery = (info) => {
     let query = `SELECT `;

          if (info.selection.length < 1) {
               query += `* `;
          } else {
               info.selection.forEach((s, i) => {
                    query += s;
                    if (i < (info.selection.length - 1)) {
                         query += ', ';
                    }
               });
          }

          query += ` FROM ${info.db}`;

          if (info.join) {
               if (info.join.length > 0) {
                    for (let i = 0; i < info.join.length; i++) {
                         query += ` JOIN ${info.join[i].db} ON `
                         let cond = Object.keys(info.join[i].on);
                         cond.map((k, j) => {
                              query += `${k} = ${info.join[i].on[k]}${((j == cond.length-1) ? ' ' : ' and ')}`
                         });
                    }
               }
          }

          if (Object.keys(info.where).length > 0) {
               query += '\n';
               query += conn.buildWhereQuery(info.where);
          }

          if (info.groupBy) {
               query += ` GROUP BY ${info.groupBy}`;
          }

     return query;
}

//Build insert query
conn.buildInsertQuery = (info) => {
     let query = ""

          query += `INSERT INTO ${info.db}(`;

          info.columns.forEach((c, i) => {
               query += c;
               if (i != (info.values.length - 1)) {
                    query += ', ';
               }
          });

          query += ')\nVALUES (';

          info.values.forEach((v, i) => {
               if (typeof v == 'number') {
                    v = v.toString();
               }
               query += ((v.startsWith("(") && v.endsWith(")")) ? `${v}` : `'${v}'`);

               if (i != (info.values.length - 1)) {
                    query += ', ';
               }
          });

          query += ')';

     return query;
}

//Build a delete query.
conn.buildDeleteQuery = (info) => {
     let query = `DELETE FROM ${info.db} `;

          query += conn.buildWhereQuery(info.where);

     return query;
}

//Build a table query.
conn.buildTableQuery = (info) => {
     let query = `CREATE TABLE IF NOT EXISTS ${info.name} (`;

          //Add each column
          info.columns.forEach((c) => {
               query += `\n${c.name} `;
               if (c.type == "ENUM") {
                    query += `${c.type}(${c.options.toString()})`;
               } else {
                    query += `${((typeof c.size != 'undefined') ? c.type + "(" + c.size + ")" : c.type )}`;
               }
               query += ((typeof c.extras != 'undefined') ? " " + c.extras + ",": ",");
          });

          //Set foreign key constraints
          if ((typeof info.constraints != 'undefined') && info.constraints.length > 0) {
               info.constraints.forEach((c) => {
                    query +=  `\nCONSTRAINT ${c.name} FOREIGN KEY(${c.fk}) REFERENCES ${c.ref}(${c.refKey}),`;
               })
          }

          //Set primary key
          if (typeof info.primaryKey != 'undefined') {
               query += `\nPRIMARY KEY (${info.primaryKey})`;
          }

     query += `\n)`;

     return query;
}

//Main call function to build queries with passed information.
conn.buildQuery = (type, info) => {
     switch(type) {
          case 'table':
               return conn.buildTableQuery(info);
               break;
          case 'insert':
               return conn.buildInsertQuery(info);
               break;
          case 'select':
               return conn.buildSelectQuery(info);
               break;
          case 'update':
               return conn.buildUpdateQuery(info);
               break;
          case 'delete':
               return conn.buildDeleteQuery(info);
               break;
          default:
               conn.printError("You must specify a type when calling buildQuery().");
               return '';
               break;
     }
}

//Combine queries with a UNION.
conn.unionQueries = (info) => {
     let query = '';

          //Iterate through each select and build them. Appending with UNION.
          for (let i = 0; i < info.length; i++) {
               query += info[i];
               if (i != (info.length-1)) {
                    query += ' UNION ';
               }
          }

     return query;
}

//Main call function to build multiple queries with passed information.
conn.buildMultiQuery = (info) => {
     let temp = [];
     for (let i = 0; i < info.length; i++) {
          temp.push( conn.buildQuery(info[i].type, info[i]) );
     }

     return conn.unionQueries(temp);
}

module.exports = conn;