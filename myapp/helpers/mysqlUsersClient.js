const mysql = require('mysql');
const util = require('util');

const usersPool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'usersdatabase.cjdyse7zes2s.us-east-2.rds.amazonaws.com',
    user            : 'usersadmin',
    password        : 'accredusers',
    database        : 'usersdatabase'
  });
  
usersPool.query = util.promisify(usersPool.query);

module.exports = usersPool;