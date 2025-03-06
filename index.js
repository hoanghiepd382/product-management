const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');
const systemConfig = require('./config/system');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const moment = require("moment");


require('dotenv').config();

const app = express();
const port = process.env.PORT;
const database = require("./config/database");
database.connect();

app.use(methodOverride('_method'));
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.use(cookieParser('H123456789'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})