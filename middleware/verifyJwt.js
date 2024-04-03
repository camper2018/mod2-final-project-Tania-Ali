const jwt = require('jsonwebtoken');
async function verifyJwt(req, res, next) {
    const { authorization: authHeader } = req.headers;
     // Check if authorization header is present and jwt token is present i.e user is logged in.
    if (!authHeader || !authHeader.split(' ')[1]) res.status(401).json({error: 'Invalid authorization, no authorization headers', success: false});
  
    const [scheme, jwtToken] = authHeader.split(' ');
    // Check if the authorization scheme is Bearer
    if (scheme !== 'Bearer') res.status(401).json({error: 'Invalid authorization, invalid authorization scheme', success: false});
  
    try {
      const decodedJwtObject = jwt.verify(jwtToken, process.env.JWT_KEY);
      // Set decoded user object to the request
      req.user = decodedJwtObject;
      // Proceed to the next middleware or api request
      await next();
    } catch (err) {
      console.log("Error:", err.message);
      // if (
      //   err.message && 
      //   (err.message.toUpperCase() === 'INVALID TOKEN' || 
      //   err.message.toUpperCase() === 'JWT EXPIRED')
      // ) {
  
      //   req.status = err.status || 500;
      //   req.body = err.message;
      //   req.app.emit('jwt-error', err, req);
      // } else {
      //   throw((err.status || 500), err.message);
      // }
      // await next();

      // Check for specific error messages and handle them accordingly
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'JWT token expired', success: false });
      } else if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ error: 'Invalid JWT token', success: false });
      } else {
          // Pass the error to the error handling middleware
          next(err);
      }
    } 
}
module.exports = verifyJwt;
