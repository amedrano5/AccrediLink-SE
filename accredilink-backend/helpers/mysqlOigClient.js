const mysql = require('mysql');
const util = require('util');

const oigPool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'oigdatabase.cjdyse7zes2s.us-east-2.rds.amazonaws.com',
    user            : 'oigadmin',
    password        : 'accredOIG',
    database        : 'oigdatabase'
  });
  
oigPool.query = util.promisify(oigPool.query);

module.exports = oigPool;