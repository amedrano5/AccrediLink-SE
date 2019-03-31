/** Imports */
import * as express from "express";
import { customError } from "../helpers/customError";
import mysqlClient from "../helpers/mysqlOigClient"
import jwt from "jsonwebtoken";
import verifyAuth from "../middleware/verifyAuth";
import puppeteer from "puppeteer"

/** Establish an Express router */
const router = express.Router();

/* Screening Route */
router.post('/', verifyAuth, async function(req, res, next) {
    try {
        let candidateInfo = req.body;
        /* candidateInfo object now looks like this:
        {
            firstName: '<first name>',
            middleName: '<middle name>',
            lastName: '<last name>',
            firstNameAlt: '<first name alias>',
            middleNameAlt: '<middle name alias>',
            lastNameAlt: '<last name alias>',
            dateOfBirth: '<yyyymmdd>',
            SSN: '<###-##-###>',
            email: '<email address>',
            phone: '<phone number>'
        }
        */

        // Clean the candidateInfo (this may be done by React instead)
        candidateInfo.firstName = candidateInfo.firstName.toUpperCase();
        candidateInfo.middleName = candidateInfo.middleName.toUpperCase();
        candidateInfo.lastName = candidateInfo.lastName.toUpperCase();
        candidateInfo.firstNameAlt = candidateInfo.firstNameAlt.toUpperCase();
        candidateInfo.middleNameAlt = candidateInfo.middleNameAlt.toUpperCase();
        candidateInfo.lastNameAlt = candidateInfo.lastNameAlt.toUpperCase();

        // Check if the candidate is in the local OIG database
        let result = await mysqlClient.query(`SELECT * FROM oigdatabase.oig_local WHERE LASTNAME = '${candidateInfo.lastName}' \
                                                AND FIRSTNAME = '${candidateInfo.firstName}' AND MIDNAME = '${candidateInfo.middleName}' \
                                                AND DOB = '${candidateInfo.dateOfBirth}';`);
        // "result" will be an empty array if no hits were found, or an array of object(s) if hit(s) were found.

        // Check if the result returned is an not array
        if(!Array.isArray(result)) {
            throw new customError("Database Query Failure", "Result returned from database is not an array.", 500);
        }
        // If the query returns no hits
        else if (!result.length) {
            // Add an oigFlag attribute to the candidateInfo object and set it to false
            // This signifies that the candidate has not been flagged for failing OIG verification. The candidate is clear.
            candidateInfo.oigFlag = false;
            // Send json object back to React
            res.json({ message: `OIG search for ${candidateInfo.firstName} ${candidateInfo.middleName} ${candidateInfo.lastName} returned no hits. Candidate has passed OIG verification.`,
                        status: 'clear' });
        }
        // Handle OIG hit(s) if there are any
        else {
            res.json({ message: 'Got a hit!',
                        status: 'failed' });
/*
            // Check the master online OIG database. Start by entering each firstname-lastname pair into the browswer.
            // Launch a headless broswer
            const browser = await puppeteer.launch({headless: true})
            // Create a new page
            const page = await browser.newPage()
            // Go to the OIG website
            await page.goto('https://exclusions.oig.hhs.gov/')
            // Enter in the firstname and lastname
            await page.type('#ctl00_cpExclusions_txtSPLastName', candidateInfo.lastName)
            await page.type('#ctl00_cpExclusions_txtSPFirstName', candidateInfo.firstName)
            // Click the "search" button
            await page.click('#ctl00_cpExclusions_ibSearchSP')
            // Wait for the current page to navigate to the next page. The next page will contain a table.
            await page.waitForNavigation()
            // Extract the data from each cell in the table and store each piece of data as an element in an array called "data"
            // Each piece of data will take the form of a string
            const data = await page.evaluate(() => {
                const tds = Array.from(document.querySelector('#ctl00_cpExclusions_gvEmployees.leie_search_results').querySelectorAll('td'))
                return tds.map(td => td.innerHTML.trim())
              });
            // Search for the cells that contain the string ">Verify</a>" and create a new array called "verifyLinks" that contains only those cells
            let verifyLinks = data.filter((el) => {
                if (el.includes(">Verify</a>")) {
                        return el
                }
            })
            // In each element of verifyLinks, trim the string so that it contains only the id of its "Verify" button
            verifyLinks = verifyLinks.map((el) => {
                let substring = el.split('id="')
                let finalSubString = substring[1].split('"')
                return finalSubString[0]
            })

            console.log(verifyLinks)

            // Loop through each "Verify" button and enter the candidate's SSN
                // If there is a match:
                    // Add an oigFlag attribute to the candidateInfo object and set it to true
                        // This signifies that the candidate has been flagged for failing OIG verification.
                    // Save any new information found within candidateInfo
                    // Take a screenshot
                    // Flesh out the oig_extended database?
                // If there is no match:
                    // Add an oigFlag attribute to the candidateInfo object and set it to false
                    // This signifies that the candidate has not been flagged for failing OIG verification. The candidate is clear.
                        // candidateInfo.oigFlag = false;
                    // Send json object back to React
                        // res.json({ message: `OIG search for ${candidateInfo.firstName} ${candidateInfo.middleName} ${candidateInfo.lastName} returned no hits. Candidate has passed OIG verification.`,
                        //             status: 'clear' });

            // Close the browser
            browser.close()
        

            res.json({"the" : JSON.stringify(verifyLinks)})
            */
        }
    }
    catch (error) {
        res.json(error);
    }
    
});

/** Export */
// Export this module for use as a route in ""../app.js"
module.exports = router;