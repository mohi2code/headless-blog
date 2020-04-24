module.exports = (sequelize, DataTypes) => {

  const Categories = sequelize.define('categories', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    }
  });

  return Categories;

}
