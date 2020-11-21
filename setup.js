const db = require('./db.js');
const mysqlSetup = require('./setup/mysql.js');
const adminSetup = require('./setup/admin_user.js');

(async () => {
     try {
          await mysqlSetup();

          await adminSetup();

          process.exit(0);
     } catch (msg) {
          db.printError(msg);
          process.exit(0);
     }
})();