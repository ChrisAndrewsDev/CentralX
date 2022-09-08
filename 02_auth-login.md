# [E2] BUILDING THE LOGIN SYSTEM: SERVER-SIDE AUTH LOGIC

## 3. LOGIN ROUTE

We will be building the auth system purely on the server to begin with - we will merely be exposing endpoints rather than creating visual content. It is important then to clearly visualise what our end goal is for each endpoint, beginning with **REGISTER/SIGN UP ROUTE**:

  - **REQUEST:** Must accept user data passed to the body (**just email & password**) & to be **CHECKED AGAINST** the Cloud Firestore `users` collection

  - **RESPONSE:** Must return two things: **(i)** the JSON user object, without password & **(ii)** the signed JWT token (*same as register*)

&nbsp;

### A. FURTHER ADDITION TO SUB-ROUTES

  - In the previous module, we already setup our register **POST** route at `localhost:5000/api/auth/register`

  - We will add another sub-route for login: **POST** route for `login` query, at `localhost:5000/api/auth/login`

&nbsp;

### B. SETTING UP EXTENDED CONTROLLER QUERY

**DESTRUCTURE SPECIFIC PROPERTIES FOR USE**
  
  - SEE REGISTER PART B - this step is NEARLY the same

  - DISTINCTION: We don't pass the username to the login route, so no need for it here

&nbsp;

### C. VALIDATING USER FOR EXISTING DATABASE DOCUMENT

**SEE REGISTER PART C - this is very similar to this**

  - DISTINCTION: In the Register route, we wanted to ensure the email was UNIQUE.  In this, as its a login, we NEED the email to **MATCH an email in the users collection**

  - **(i) Find Existing User:** We call the `findUser` function (in our utility file) and pass in the email 

  - **(ii) Reject NON-MATCH:** We check first that the `userMatch.length === 0`
    
    - If it is false, it means the email passed by the user DO NOT EXIST in the DB
    
    - If no entry in db, user does NOT exist and we need to reject their authentication 

&nbsp;

### D. VALIDATING USER BY BLOCKING NON-MATCHING PASSWORD

**REMINDER:** The `findUser` function returns, if a match, the entire user doc that relates to the email! So if TRUE, the `userMatch` variable will contain the entire user `doc`, including id = THIS WILL BE VERY USEFUL!

  - **(i) Create & call NEW comparePassword utility function [`authServices.js`]**
      
    - Pass in the user doc (`userMatch`) & the password entered in the login by the user (`password`)

  - **(ii) We extract the encrypted password from the user doc**
  
    - Store encrypted password as `hashedPassword`
      
  - **(iii) Compare password passed in with DB hashed password via `bcrypt` for match**
      
    - Uses "compare" method from the bcrypt library = does the decryption for us!

  - (iv) Return the passwordMatch result 
    
  - **(v) Check the passwordMatch result for a non-match**
    
    - If no match, we reject the request and return a 400 error!

&nbsp;

### E. CONFIRM LOGIN & CONVERT USER DETAILS TO JSON 

SEE REGISTER PART E - this is a almost the same as the register step

  - Like `register`, we want to return the user details in a JSON object & token 
      
  - HOWEVER our `userMatch` has the stored user id we need, rather than `response.id`

  - **(i) Construct the User JSON with existing data**
  
    - Pass the user id (`userMatch[0].id`) to reconstruct the user data in the structure we want
      
    - KEY: We need to remove the password from it
      
    - Otherwise, we could just try and remove it from the `userMatch` variable, but we will keep it consistent for simplicity, despite being a bit slower

  - **(ii) Return the userJSON**

  - **(iii) Output User Object & Token to Client**

    - SEE REGISTER PART F - this step is exactly the same!

&nbsp;

- **DOCUMENTATION:**

  - **bcrypt:** https://github.com/kelektiv/node.bcrypt.js#readme

  - **lodash:** https://lodash.com/

  - **jsonwebtoken:** https://github.com/auth0/node-jsonwebtoken#readme

  - **jsonwebtoken checker:** https://jwt.io/ 