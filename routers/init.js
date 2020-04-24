module.exports = (controllers) => {

  const api = require('./api')(controllers);

  return { api };

}
