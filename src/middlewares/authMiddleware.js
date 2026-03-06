import jwt, { decode } from "jsonwebtoken";

export const protect = (req, res, next) => {
    let token;

    // check if the authentication exist in bearer
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

        try {   
            // extract token from bearer
            token = req.headers.authorization.split(" ")[1];

            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded);
            

            // attach user info to the request
            req.user = decoded;

            // constinue to the next middleware
            next();

        } catch (error) {
            return res.status(401).json({ message: " Not authorized!, invalid token"});
        }
    }
    else{
        return res.status(401).json({ message: " Not authorized!, no token"})
    }
};


export const authorizeAdmin = (req, res, next) => {

    if (req.user && req.user.role === "admin") {
        next();

    } else {
        return res.status(403).json({ message: "Access Denied!, Admin only route"});
    }
}


 export default{ protect, authorizeAdmin }