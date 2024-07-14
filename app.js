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

// 跨域相关配置
const originUrl = 'http://localhost:8080';
const cors = require('cors');
app.use(cors({
  origin: originUrl,
  credentials: true
}));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', originUrl);
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

const passport = require('./config/passport'); // 引入 Passport 配置模块
app.use(passport.initialize());
app.use(passport.session());

// 模块引入
// ========================
// 引入路由模块
var authRouter = require('./routes/auth');
var orderRouter = require('./routes/order');
var userRouter = require('./routes/user');
var medicineRouter = require('./routes/medicine');
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
      req.originalUrl == '/auth/admin' ||
      req.originalUrl == '/auth/admin/register' ||
      req.originalUrl.startsWith('/medicine')
    ) {
      next();
    } else {
      res.status(401).json({
        status: '10010',
        message: '当前未登录',
      });
    }
  }
});
// 交由各个模块处理请求
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use('/order', orderRouter);

app.use('/medicine', medicineRouter);

// 启动服务器
// ========================
app.listen(3000, function () {
  console.log('App is listening at port 3000');
});
