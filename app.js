// set up ----------------------------------------------------------------------
const { Sequelize, DataTypes } = require('sequelize');
const express                  = require('express');
const bodyParser               = require('body-parser');

// configuraion ----------------------------------------------------------------
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/blog.sqlite'
});
const models      = require('./models/init')(sequelize, DataTypes);
const controllers = require('./controllers/init')(models);
const router      = require('./routers/init')(controllers);
const app         = express();
app.use(bodyParser.json());
app.use('/api', router.api);


// connecting the database and fire up the server ------------------------------
sequelize.sync()
.then(async () => {

  console.log('Connection Has been made to the db');

  // starting express
  app.listen('3000', () => {
    console.log('Server started on port 3000');
  });

})
.catch(err => {
  console.log(err);
});
