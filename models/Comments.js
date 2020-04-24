module.exports = (sequelize, DataTypes) => {

  const Comments = sequelize.define('comments', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1
    },
    username: {
      type: DataTypes.UUID,
      allowNull: false
    },
    postId: {
      type: DataTypes.UUID,
    },
    content: {
      type: DataTypes.TEXT
    }
  });

  return Comments;

}
