module.exports = (sequelize, DataTypes) => {

  const Users = require('./Users')(sequelize, DataTypes);
  const Posts = require('./Posts')(sequelize, DataTypes);
  const Comments = require('./Comments')(sequelize, DataTypes);

  // relationships
  Users.hasMany(Posts, {
    foreignKey: {
      name: 'author',
      allowNull: false
    }
  });
  Users.hasMany(Comments, {
    foreignKey: {
      name: 'username',
      allowNull: false
    }
  });
  Posts.hasMany(Comments, {
    foreignKey: {
      name: 'postId',
      allowNull: false
    }
  });
  Comments.hasMany(Comments, {
    foreignKey: {
      name: 'parent'
    }
  });

  return { Users, Posts, Comments };
}
