module.exports = (sequelize, DataTypes) => {

// defining users schema
  const Users = sequelize.define('users', {
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(
        ['public', 'author', 'admin']
      ),
      allowNull: false
    }
  });

  return Users;

}
