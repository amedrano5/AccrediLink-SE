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
router.post('/', async function(req, res, next) {
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
            // Do not flag the candidate
            candidateInfo.oigFlag = false;
            // Send json object back to React
            res.json({ message: `OIG search for ${candidateInfo.firstName} ${candidateInfo.middleName} ${candidateInfo.lastName} returned no hits. Candidate has passed OIG verification.`,
                        status: 'clear' });
        }
        // Handle OIG hits if there are hit(s)
        else {
            // res.json({ message: 'Got a hit!',
            //             status: 'failed' });

            // Check the master online OIG database using candidate's SSN
            const browser = await puppeteer.launch({headless: true})
            const page = await browser.newPage()
            await page.goto('https://exclusions.oig.hhs.gov/')
            await page.type('#ctl00_cpExclusions_txtSPLastName', candidateInfo.lastName)
            await page.type('#ctl00_cpExclusions_txtSPFirstName', candidateInfo.firstName)
            await page.click('#ctl00_cpExclusions_ibSearchSP')
            await page.waitForNavigation()
            const data = await page.evaluate(() => {
                const tds = Array.from(document.querySelector('#ctl00_cpExclusions_gvEmployees.leie_search_results').querySelectorAll('td'))
                return tds.map(td => td.innerHTML.trim())
              });

            let verifyLinks = data.filter((el) => {
                if (el.includes(">Verify</a>")) {
                        return el
                }
            })

            verifyLinks = verifyLinks.map((el) => {
                let substring = el.split('id="')
                let finalSubString = substring[1].split('"')
                return finalSubString[0]
            })

            console.log(verifyLinks)
            browser.close()
            res.json({"the" : JSON.stringify(verifyLinks)})

            // If master returns a match:
                // Flag candidate as having failed the OIG verification
                // Flesh out the oig_extended database?
        }
    }
    catch (error) {
        res.json(error);
    }
    
});

/** Export */
// Export this module for use as a route in ""../app.js"
module.exports = router;