'use strict';

const path = require('path');

const AV = require('leanengine');
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require('./cloud');

const app = new Koa();

// 设置静态资源目录
app.use(serve(path.join(__dirname, 'public')));

const router = new Router();
app.use(router.routes());

// 加载云引擎中间件
app.use(AV.koa());

app.use(bodyParser());
// 跨域
app.use(cors());

app.use(require('./routes/api').routes());

module.exports = app;