const AV = require('leanengine');
const Router = require('koa-router');

const router = new Router({
    prefix: '/api'
});
const Order = AV.Object.extend('Order');

function toJSON(obj) {
    let result = obj.attributes;
    result.id = obj.id;
    return result;
}

function toJSONList(list) {
    return list.map(toJSON);
}

function success(data = null, code = 0, msg = '成功') {
    return {
        msg,
        code,
        data
    };
}

router.get('/product/list', async (ctx) => {
    let query = new AV.Query('Product');
    let list = await query.find();
    ctx.body = success(toJSONList(list));
}).post('/order/submit', async (ctx) => {
    let body = ctx.request.body;
    let query = new AV.Query('Product');
    let number = Number(body.number);
    if (!body.name || !Number.isInteger(number)) {
        ctx.body = success(null, 1, '参数错误');
        return false;
    }

    try {
        let product = await query.get(body.productId);
        let order = new Order();
        order.set('product', product);
        order.set('number', number);
        order.set('remark', body.remark);
        order.set('name', body.name);
        order.set('price', product.get('price') * number);
        let data = await order.save();
        let result = toJSON(data);
        result.product = toJSON(data.get('product'));
        ctx.body = success(result);
    } catch (error) {
        console.log(error);
        ctx.body = success(null, 1, '产品不存在');
    }
}).get('/order/list', async (ctx) => {
    let query = new AV.Query('Order');
    let start = new Date();
    start.setHours(0, 0, 0, 0);
    let end = new Date();
    end.setHours(23, 59, 59, 999);

    query.greaterThan('updatedAt', start);
    query.lessThan('updatedAt', end);
    query.include(['product']);
    let list = await query.find();
    let result = list.map(item => {
        let res = toJSON(item);
        res.product = toJSON(item.get('product'));
        return res;
    });
    ctx.body = success(result);
});

module.exports = router;