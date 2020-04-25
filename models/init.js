module.exports = (sequelize, DataTypes) => {

  const Users = require('./Users')(sequelize, DataTypes);
  const Posts = require('./Posts')(sequelize, DataTypes);
  const Comments = require('./Comments')(sequelize, DataTypes);
  const Categories = require('./Categories')(sequelize, DataTypes);

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
    }
  });
  Comments.hasMany(Comments, { foreignKey: 'parentId' });
  Categories.hasMany(Posts, { foreignKey: { name: 'category' } });

  return { Users, Posts, Comments, Categories };
}
