const pool = require("../dbConfig/neonDB.js");
const logger = require('../utils/logger'); // Importing the logger utility
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {

    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ status: "fail", message: "Username and Password are required" });
    }

    try {
        const dbConnect = await pool.connect();
        const result = await dbConnect.query("SELECT * FROM USERS WHERE username = $1", [username]);

        if (result.rowCount != 1) {
            return res.status(401).json({ status: "fail", message: "User Not Found" });
        }
        // console.log("User Found", result.rows[0].username);
        const isMatch = await bcrypt.compare(password, result.rows[0].password);

        if (!isMatch) {
            return res.status(401).json({ status: "fail", message: " Password Incorrect " });
        }

        const userId = result.rows[0].userid;
        const userName = result.rows[0].username;
        const payload = { userId, userName };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '59m' });

        if (!token) {
            return res.status(401).json({ status: "fail", message: "Login Fail" })
        }

        dbConnect.release();

        res.status(200).json({
            status: "success",
            message: "Login Successful ",
            token,
        });
    } catch (error) {
        logger.error('Login Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

const handleSignup = async (req, res) => {

    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
        return res.status(400).json({ status: "fail", message: "Username, Email, and Password are required" });
    }

    try {

        const hashpassword = await bcrypt.hash(password, 12);

        const dbConnect = await pool.connect();
        let result = await dbConnect.query("SELECT * FROM  USERS WHERE username = $1 OR email = $2 OR password = $3", [username, email, hashpassword]);

        if (result.rowCount != 0) {
            return res.json({ status: "fail", message: "Cridentials already Exit", })
        }

        result = await dbConnect.query(
            "INSERT INTO USERS( username, password, email) VALUES($1, $2, $3)",
            [username, hashpassword, email]
        );

        if (result.rowCount != 1) {
            console.log('not')
            return res.json({ status: "fail", message: " Registration Fail ", })
        }

        dbConnect.release();
        res.json({ status: "success", message: "User Register Successful", });
        console.log("handleregister");

    } catch (err) {
        res.json({ status: "error", message: " Registration Fail Error", })
        console.error(err);
    }
};

module.exports = {
    handleLogin,
    handleSignup,
};