const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    try {

        const authHead = req.headers.Authorization || req.headers.authorization;
        if (!authHead) {
            return res.status(401).json({ status: "Unauthorized", message: "Access Denied: No Token Provided" });
            //redirect to login page.
        }

        const token = authHead.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

            if (err) {
                return res.status(401).json({ status: "Unauthorized", message: "Invalid or Expired Token" });
            }

            req.user = decoded;

            next();
        });

    } catch (err) {
        res.status(500).json({ status: "error", message: "Server Error" });
        console.log(err);
    }

}

module.exports = { verifyToken };