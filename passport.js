var db = require("./db"); // db
var conn = db.init();

const bcrypt = require("bcrypt"); // 패스워드 해시용 라이브러리
const passport = require("passport"); // 패스포트
const passportJWT = require("passport-jwt"); // 패스포트
const JWTStrategy = passportJWT.Strategy; // passportJWT 의 스트래터지 클래스를 불러옴
const { ExtractJwt } = passportJWT; // 토큰 만들기용
const LocalStrategy = require("passport-local").Strategy; //  passport-local 의 스트래터지 클래스를 불러옴

db.connect(conn);

const LocalStrategyOption = {
    usernameField: "user_id",
    passwordField: "password",
};

async function LocalVerify(user_id, password, done) {
    var user;
    try {
        var sql = "select * from user where user_id = ?";
        var params = [user_id];
        await conn.qurey(sql, params, async function (err, rows, fields) {
            if (err) {
                console.log(err);
                return done(null, false);
            }
            if (!rows[0]) return done(null, false);
            user = rows[0];

            console.log(password, user.password);
            const checkPassword = await bcrypt.compare(password, user.password);
            console.log(checkPassword);
            if (!checkPassword) return done(null, false);

            console.log(user);
            return done(null, user);
        });
    } catch (e) {
        return done(e);
    }
}

const JWTStrategyOption = {
    jwtFormRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "jwt-secert-key",
};

async function jwtVerift(payload, done) {
    var user;
    try {
        var sql = "select * from user where user_id = ?";
        var params = [payload.user_id];
        await conn.query(sql, params, function (err, rows, fields) {
            if (!rows[0]) return done(null, false);
            user = rows[0];

            console.log(user);
            return done(null, user);
        });
    } catch (e) {
        return done(e);
    }
}

module.exports = () => {
    passport.use(new LocalStrategy(LocalStrategyOption, LocalVerify));
    passport.use(new JWTStrategy(JWTStrategyOption, jwtVerift));
};
