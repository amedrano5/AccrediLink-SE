/** Imports */
import * as express from "express";
import { customError } from "../helpers/customError";
import mysqlClient from "../helpers/mysqlUsersClient"
import jwt from "jsonwebtoken";

/** Establish an Express router */
const router = express.Router();

/** Authentication/Login Route */
router.post('/', async function(req, res, next) {
    try {
        // Get the login credenitals that were passed in with the authentication POST request as a json object
        let loginCredentials = req.body;
        /** loginCredentials object now looks like this:
        {
            username: '<username>',
            password: '<password>'
        }
        */
        
        // Create a user object
        let user = {
            username : '',
            user_type : ''
        };

        // Create a user object
        let token = '';

        // Query the "users" database to search for the username
        const result = await mysqlClient.query(`SELECT * FROM usersdatabase.users WHERE username = '${loginCredentials.username}';`);
        /** "result" is an array of objects that contains just one object: [ RowDataPacket { username: '<username>', password: '<password>', user_type: '<user type>'} ]
            user_type is an enumerated type with values: 'admin', 'support', 'professional', and 'agency' */

        // Check if the result returned is an not array
        if(!Array.isArray(result)) {
            throw new customError("Database Query Failure", "Result returned from database is not an array.", 500);
        }
        // Check if the username exists
        else if (!result.length) {
            throw new customError("Login Failure", `Username '${loginCredentials.username}' does not exist.`, 400);
        }
        // If the user name exists, create a user object with the login credentials to be passed to Json Web Token
        else {
            user.username = result[0].username;
            user.user_type = result[0].user_type;
        }

        // Check if the password is correct
        if (loginCredentials.password === result[0].password) {
            // Assign a token to the user
            token = jwt.sign(user, "accredusers", {expiresIn: "1h"});
        }
        else {
            throw new customError("Login Failure", `Password did not match username '${loginCredentials.username}'.`, 400);
        }
        // Send token to React
        // The token contains the user object (amongst other things), so React will now have access to the user information
        res.json(token);
    }
    catch (error) {
        res.json(error);
    }
});

/** Export */
// Export this module for use as a route in ""../app.js"
module.exports = router;
