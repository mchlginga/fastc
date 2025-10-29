# Coding Notes

<!-- config -->
- create dev, prod, and index.js
- create db connection function

<!-- server.js -->
- import local modules 
- connect db
- run express server

<!-- utils -->
- create constants function module
- create ensure directory exist function module
- create ensure file exist function module
- generate token using jwtwebtoken

<!-- app.js -->
- helmet for http headers security
- express.json to parse json data
- cookie-parse to read/write cookies
- morgan for access logs
- import local modules
- create custom error handling middleware
- mount route modules for api endpoints
- setup cors to allow backend and frontend origins
- origin: frontend
- methods: GET POST PUT DELETE PATCH OPTION
- allowedHeaders:
- exporedHeaders:

<!-- middleware -->

auth.js
- create auth to verify and attach user to req.user
- kunin yung token na galing sa frontend req.header.auth or req.cookies.token
- decode yung token gamit jwt for verification
- hanapin yung user gamit yung token na naka attack sa id

<!-- models -->

Trainee.js:
- create schema for trainees
- .pre is a middleware or hooks na feature ng mongoose
- yung (next) sa hook pattern is a callback function

<!-- controllers (api logics) -->

trainee/:

auth.js:
- create auth.js to all authorization api logics
- set cookie config
- COOKIE_NAME, cookieOptions( http: true, security: true, sameSite: "none",path: /)
- set cookie token: ilagay yung generate token na galing sa utils, respond cookie to frontend
- syntax: cookie name, token, cookieOptions

register:
- create trainee account
- error handling
- const traineeData = {req.body};
- initialize verificationCode and verificationCodeExpires
- await sendVerificationEmail()
- const trainee = await Trainee.create(traineeData);
- const publicTrainee = await findById(trainee._id).select("-password");
- 

login:
- log account
- errorhandling
- generateToken(id)
- const publicTrainee = await Trainee.findById(trainee._id).select("-password")

---

profile.js:

- create getprofile
- await Trainee.findById(req.user._id).select("-password")
- error handling
- respond trainee data


<!-- routes -->
- create modules about url pathing endpoints sa controllers
