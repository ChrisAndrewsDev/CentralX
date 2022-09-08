# [E2] BUILDING THE LOGIN SYSTEM: SERVER-SIDE AUTH LOGIC

## 1. OVERVIEW OF AUTH/LOGIN SYSTEM

**CURRENTLY:** Our Application, from front to back, does NOT talk to each other.  We have a client ready to accept some dynamic, stateful content & we have a backend setup to extend routes with.  Ideally, our next stages need to build:

  - Managing user sessions via authentication 

  - Applying authorisation to specific routes on the client, to protect certain services

  - **CORE FEATURES TO SETUP:** Authentication and authorisation (including Time-To-Live) to manage tokens & secure routes 

&nbsp;

## 2. REGISTER ROUTE

We will be building the auth system purely on the server to begin with - we will merely be exposing endpoints rather than creating visual content. It is important then to clearly visualise what our end goal is for each endpoint, beginning with **REGISTER/SIGN UP ROUTE**:

  - **REQUEST:** Must accept user data passed to the body & to be saved to Cloud Firestore, `users` collection

  - **RESPONSE:** Must return two things: **(i)** the JSON user object, without password & **(ii)** the signed JWT token

&nbsp;

### A. ADDITION TO SUB-ROUTES

  - In the previous class, we already exteneded our routes to `authRoutes.js` & added a **GET** test sub-route at `localhost:5000/api/auth/users`

  - We merely add another sub-route for signups: **POST** route for `register` query, at `localhost:5000/api/auth/register`

  - We can now write the function for this endpoint, within the already-created `authController.js`

&nbsp;

### B. SETTING UP EXTENDED CONTROLLER QUERY

**SETUP STANDARD TEMPLATE FOR OUR CONTROLLER:**

  - Import the `db` object (*which we can call firestore methods from*)

  - Import our `ApiError` class 

  - Setup the `module.exports` for our register (and login) route

**DESTRUCTURE SPECIFIC PROPERTIES FOR USE**
  
  - We want to destructure all user variables from the req.body, so we can more easily reference them in our register route (same for login route)

&nbsp;

### C. VALIDATING USER AGAINST DUPLICATE USERNAMES

To ensure data integrity, we will also need to check that the email isn't already in use in our DB.

**IMPORTANT:** We will also start building in re-usable auth functions into a NEW utility file, as there will be A LOT of overlap with the login route:
    
  - **(i) Create NEW `authServices.js` utility file**
    - Import the db object 
    - Import config file (access app secret for jwt token)
    - Setup module.exports for all nested functions 

    - *IMPORTANT: MAKE SURE TO KEEP IMPORTING EACH FUNCTION INTO THE AUTH CONTROLLER AS REQUIRED!*

  - **(ii) Create NEW findUser function in `authServices.js`**
        
    - **FUNCTIONALITY:** Like our `listUsers`, it will retrieve all docs in the users collection, so we can search the email against them, to check for a duplicate in our DB 

    - Set our DB variables & call GET on users collection
    - Push each user doc into users array for manipulation
    - Search the user email passed in against all emails in the users DB array 
    - Return value for match (*we MAY or MAY NOT want a match*)
    
  - **(iii) Checking for username MATCH (duplicate):**

    - Using `if statement`, if length of the findUser output is equal to 1, it means a MATCH [`authController.js`]

    - If `TRUE`, we reject as we want a unique email on registration! 

    - REMINDER: The findUser function returns, if a match, the entire user `doc` that relates to the email! So if it contains the user `doc`, it will be TRUE!

&nbsp;

### D. SAVING USER DATA TO DATABASE

  - **(i) Set our DB variables & call ADD on users collection [`authController.js`]** 

  - **(ii) Pass in destructured variables EXCEPT for password [`authController.js`]**

    - NOTE: We set isAdmin by default to FALSE. 
    
    - Reason is we should only give this authorisation via hard-coding it into our DB, require that the admin pass an app secret to gain access or only allow other admin users to confer admin authorisation privledges!

  - **(iii) Install encryption software: BCRYPT [`authServices.js`]**
    - INSTALL BCRYPT: `yarn add bcrypt` / `npm i bcrypt`
    
    - IMPORT bcrypt: `const bcrypt = require('bcrypt');` 
      
    - NOTE: This is our encryption software and will protect our password in the DB 

  - **(iv) Encrypt password in NEW hashPassword function [`authServices.js`]**
    - Pass in the password as a parameter of the function
    - Encrypt our password via "hash & salt"
    - This encrypted password is saved to DB, which we should see in Firestore as random alphanum 

    - NOTE: Must tell the function to "await" as we ADD to DB, so it AWAITS for hash/salt to occur!

&nbsp;

**AT THIS POINT, THE USER IS SAVED.  BUT WE WANT TO RETURN USER JSON + TOKEN.  WE WILL NEED TO STRUCTURE THIS**

&nbsp;

### E. CONFIRM REGISTRATION + CONVERT USER DETAILS TO JSON

  - **(i) Check we have received the response.id on save [`authController.js`]**
    
    - Confirms the save occurred and we have access to the id
    
    - WE NEED THIS FOR NEXT STEP!

  - **(ii) Install utility software: LODASH [`authServices.js`]**
    
    - INSTALL LODASH: `yarn add lodash` / `npm i lodash`
    
    - IMPORT lodash: `const _ = require('lodash');`
    
    - NOTE: This is a utility software, and we will use it to help modify our user JSON object to how we want it!

  - **(iii) Pass response.id to NEW userDetailsToJSON function [`authServices.js`]**

    - Call New Registered User Data (another DB call, to get back the user data we JUST saved)
    
    - **COMPARE:** *Sequelize is much friendlier, it just returns this data on save.  We have to request it = slower!*

    - Convert Data to JSON (**EXCEPT password!**) by using the spread operator to merge the `id` into the user object (it sits OUTSIDE it in the DB)

    - NOTE: We also call a `lodash` method to EXCLUDE the password while reconstructing the user object.  

    - Return the user `JSON` object back to the controller

&nbsp;

### F. OUTPUT USER OBJECT + TOKEN TO CLIENT AS RESPONSE

  - **(i) Call `res.send` and pass the user JSON AND the token function [`authController.js`]**

  - **(ii) Install token software: JSONWEBTOKEN [`authServices.js`]**

    - INSTALL JWT: `yarn add jsonwebtoken `/ `npm i jsonwebtoken`
     
    - IMPORT jwt: `const jwt = require('jsonwebtoken');`

    - NOTE: This is our token software, and it will encrypt our user data, app secret and expiry into an effective e-passport to pass around our React application safely!

  - **(iii) Create the token by calling NEW jwtSignUser function and pass in user JSON object [`authServices.js`]**

    - **Declare variables for generation of token:**

      - We set the user JSON to be the `payload`

      - We sign the token with our application key, which we set in our `config.js` & our `.env` (*we set is as "password" for testing*)
        
    - **We SET Time-To-Live (TTL) to expire after 24 hours:**
        
      - NOTE: We adjust our token function to include an expiry, otherwise it could persist in the browser for a long time
          
      - This is known as configuring the TTL of a token, which is important, as we do not want this sensitive data persisting too long in memory

    - **Generate token:**
    
      - NOTE: We create the token from user details, signs it with the app secret & sets an expiry
        
      - REMINDER: We obtain our application secret from the config file, under authentication 

    - Return token as ouput

&nbsp;

**SERVER SIGN UP IS COMPLETE! WITH LOG IN, IT WILL BE FASTER, AS WE RE-USE MANY UTILITY FUNCTIONS**

&nbsp;

- **DOCUMENTATION:**

  - **bcrypt:** https://github.com/kelektiv/node.bcrypt.js#readme

  - **lodash:** https://lodash.com/

  - **jsonwebtoken:** https://github.com/auth0/node-jsonwebtoken#readme

  - **jsonwebtoken checker:** https://jwt.io/ 