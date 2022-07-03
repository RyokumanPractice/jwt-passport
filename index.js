const passport = require("passport");
const passportConfig = require("./passport");

app.use(passport.initialize());
passportConfig();
