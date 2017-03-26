const restify = require('restify');

const authMiddleware = (req, res, next) =>
  ((req.params.token !== process.env.SECTOKEN) ?
    next(new restify.errors.UnauthorizedError()) : next());

module.exports = authMiddleware;
