const express = require('express');
const session = require('express-session');
const app = express();

// 初始化
// ========================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 小时的毫秒数
}));

const flash = require('connect-flash');
app.use(flash());

const cors = require('cors');
app.use(cors())

const passport = require('./config/passport'); // 引入 Passport 配置模块
app.use(passport.initialize());
app.use(passport.session());

// 模块引入
// ========================
// 引入路由模块
var authRouter = require('./routes/auth');
var user = require('./routes/user');
// 连接数据库
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Dongdong')

// 路由请求处理
// ========================
// 拦截未登录请求
app.all('/*', function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    // 登录 注册 浏览商品等操作无需登录
    if (req.originalUrl == '/auth/login' ||
      req.originalUrl == '/auth/register' ||
      req.originalUrl.indexOf('/goods/list') > -1
    ) {
      next();
    } else {
      res.json({
        status: '10010',
        msg: '当前未登录',
      });
    }
  }
});
// 交由各个模块处理请求
app.use('/auth', authRouter);
app.use('/user', user);


// 启动服务器
// ========================
app.listen(3000, function () {
  console.log('App is listening at port 3000');
});
