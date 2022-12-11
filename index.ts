import dotenv from 'dotenv';
import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import Router from '@koa/router';

import User from './db/models/user'
import Comments from './db/models/comments'
import Post from './db/models/post'
import sequelize from './db/db'
import IndexRouter from './routes/index'

dotenv.config();

const app = new Koa();
const router = new Router();
const port = process.env.PORT;

// router.use(cookieParser())
// router.use(morgan('dev'));
// router.use(bodyParser.urlencoded({extended: true}));
// router.use(bodyParser.json());


app.use(async function(ctx, next){
  try {
    return await next();
	} catch (err) {
    ctx.status = 500
    ctx.body = err
	}
});

app.use(bodyparser());

router.use('/user', IndexRouter)


app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    await User.sync({ force: true })
    await Post.sync({ force: true })
    await Comments.sync({ force: true })
    console.log('Connection has been established successfully.');
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    await sequelize.query(`

      INSERT INTO 
        users("first_name", "last_name", "email", "password", "created_at", "updated_at") 
      VALUES 
        ('Martin', 'Macchi', 'martin@mail.com', '123456' ,NOW(), NOW()),
        ('Tomas', 'Macchi', 'tomas@mail.com', '123456', NOW(), NOW()),
        ('Lucas', 'Macchi', 'lucas@mail.com', '123456', NOW(), NOW());

    `)
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

app.use(router.routes());
