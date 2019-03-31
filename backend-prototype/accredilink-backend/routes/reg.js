/** Imports */
import * as express from "express";
import { customError } from "../helpers/customError";
import mysqlClient from "../helpers/mysqlUsersClient"
import jwt from "jsonwebtoken";

/** Establish an Express router */
const router = express.Router();

/** Registration Route */
router.post('/', async function(req, res, next) {
    try {
        // Get the desired login credenitals that were passed in with the registration POST request as a json object
        let loginCredentials = req.body;
        /** loginCredentials object now looks like this:
        {
            username: '<username>',
            password: '<password>',
            user_type: '<user type>'
        }
        user_type is an enumerated type with values: 'admin', 'support', 'professional', and 'agency' */
        
        // Create a user object
        let user = {
            username : '',
            user_type : ''
        };

        // Query the "users" database to check if the username is already taken
        let result = await mysqlClient.query(`SELECT * FROM usersdatabase.users WHERE username = '${loginCredentials.username}';`);
        /** "result" is an array of objects that contains just one object: [ RowDataPacket { username: '<username>', password: '<password>', user_type: '<user type>'} ] */

        // Check if the result returned is an not array
        if(!Array.isArray(result)) {
            throw new customError("Database Query Failure", "Result returned from database is not an array.", 500);
        }
        // Check if the username is already taken
        else if (result.length) {
            throw new customError("Registration Failure", `Username '${loginCredentials.username}' is taken. Try a different username.`, 400);
        } 
        // Check if the username given is outside the acceptable length for our MySQL database (needs to be no more than 45 characters)
        else if (loginCredentials.username.length > 45) {
            throw new customError("Registration Failure", `The username entered is too long (must be 45 characters or less). Try a different username.`, 400);
        }
        // Check if the password given is outside the acceptable length for our MySQL database (needs to be no more than 45 characters)
        else if (loginCredentials.password.length > 45) {
            throw new customError("Registration Failure", `The password you entered is too long (must be 45 characters or less). Try a different password.`, 400);
        }
        // Check that the user_type given is one of the acceptable enumerated types
        else if (loginCredentials.user_type !== 'admin' && loginCredentials.user_type !== 'support' && loginCredentials.user_type !== 'professional' && loginCredentials.user_type !== 'agency') {
            throw new customError("Registration Failure", `'${loginCredentials.user_type}' is not a valid user_type.`, 400);
        }
        // If the username is not already taken, create a user object with the login credentials
        else {
            user.username = loginCredentials.username;
            user.user_type = loginCredentials.user_type;
        }

        // Insert user into the users database
        result = await mysqlClient.query(`INSERT INTO usersdatabase.users VALUES ('${loginCredentials.username}', '${loginCredentials.password}', '${loginCredentials.user_type}');`);

        // Assign a token to the user
        let token = jwt.sign(user, "accredusers", {expiresIn: "1h"});

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
