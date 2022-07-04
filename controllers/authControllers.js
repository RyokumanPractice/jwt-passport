const express = require("express");
const db = require("../db");
const conn = db.init;
const passport = require("passport");
const jwt = require("jsonwebtoken");

db.connect(conn);

const login = async (req, res, next) => {
    try {
        passport.authenticate("local", { session: false }, (err, user) => {
            if (err || !user) {
                console.log(err);
                return res.status(400).json({ s });
            }
        });
    } catch (e) {}
};
