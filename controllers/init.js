module.exports = (models) => {

  let User = require('./User')(models);
  let Post = require('./Post')(models);
  let Comment = require('./Comment')(models);

  return { User, Post, Comment };

}
