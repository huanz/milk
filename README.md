# 姚老板的奶茶店

姚老板的奶茶店内部点餐专用接口

## API

```
prefix = https://milk.leanapp.cn/api/
```

### 产品列表

```js
{
    url: `${prefix}/product/list`,
    response: [{
        price: 14, // 产品单价
        name: '小山绿奶茶', // 产品名称
        id: '5b56c6c2808ca4006fa252b0' // 产品id
    }]
}
```

### 订单提交

```js
{
    url: `${prefix}/order/submit`,
    data: {
        productId: '5b56ca83128fe1002f6b65bf', // 产品id
        number: 1,  // 购买数量
        name: 'bukas', // 姓名
        remark?: '' // 备注信息 [可选]
    },
    response: {

    }
}
```

### 当日订单列表

```js
{
    url: `${prefix}/order/list`,
    response: [{
        number: 1, // 数量
        name: 'bukas', // 姓名
        product: {
            price: 18,
            name: '柠檬益夏',
            id: '5b56ca83128fe1002f6b65bf'
        },
        price: 18, // 总价
        remark: '', // 备注
        id: '5b56e9b5ee920a003c8fe6df'
    }]
}
```