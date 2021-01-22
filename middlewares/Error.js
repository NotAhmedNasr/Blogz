const errorHandler = (err, req, res, next) => {
  if (err.message === 'Unauthenticated') {
    return res.status(401).end('Invalid username or password');
  } else if (err['_message'] === 'User validation failed') {
    return res.status(400).end('Incomplete Registeration Data');
  } else if (err.status === 400) {
    return res.status(400).end('Invalid body format');
  } else if (err.code === 11000) {
    return res.status(400).end('Duplication');
  } else if (err.message === 'jwt must be provided') {
    return res.status(403).end('Unauthorized');
  } else if (err.message === 'jwt expired') {
    return res.status(408).end('Session expired');
  } else if (err.message === 'jwt malformed') {
    return res.status(403).end('Unauthorized');
  } else if (err.message === 'NotFound') {
    return res.status(404).end('Not Found');
  } else if (err.message === 'Unauthorized') {
    return res.status(403).end('Unauthorized');
  }
  res.status(400).json(err.message);
}
;

module.exports = errorHandler;
