(function () {
    var apiBase = '/api';
    var apis = {
        productList: apiBase + '/product/list',
        submit: apiBase + '/order/submit',
        orderList: apiBase + '/order/list',
        delete: apiBase + '/order/delete'
    };
    var Home = {
        template: '<div><img class="fix" src="http://ournqpcso.bkt.clouddn.com/WechatIMG100.png" alt="微信支付"><h2>点餐&nbsp;&nbsp;<a href="http://ournqpcso.bkt.clouddn.com/WechatIMG87.jpg" target="_blank">查看菜单</a>&nbsp;&nbsp;<router-link to="/order">查看订单</router-link></h2><form class="form" v-on:submit.prevent="order()"><div class="flex-left units-gap"><label class="unit-0 text-right" for="multiple-inputs-name" style="width:85px;">产品: </label><div class="unit"><select v-model="params.productId" required><option v-for="item in list" v-bind:value="item.id">{{item.name}}-{{item.price}}</option></select></div></div><div class="flex-left units-gap"><label class="unit-0 text-right" for="multiple-inputs-name" style="width:85px;">数量: </label><div class="unit"><input type="number" name="number" v-model.number="params.number" placeholder="产品数量" required/></div></div><div class="flex-left units-gap"><label class="unit-0 text-right" for="multiple-inputs-name" style="width:85px;">姓名: </label><div class="unit"><input type="text" name="name" v-model="params.name" placeholder="姓名" required/></div></div><div class="flex-left units-gap"><label class="unit-0 text-right" for="multiple-inputs-name" style="width:85px;">备注: </label><div class="unit"><input type="text" name="remark" v-model="params.remark" placeholder="备注"/></div></div><div class="flex-left"><button type="submit" class="btn btn-primary">下单</button></div></form></div>',
        data: function () {
            return {
                list: [],
                params: {
                    productId: '',
                    name: '',
                    remark: '',
                    number: 1
                }
            };
        },
        created: function () {
            this.getList();
        },
        methods: {
            getList: function () {
                var _this = this;
                axios.get(apis.productList).then(function (res) {
                    _this.list = res.data.data;
                });
            },
            order: function () {
                var _this = this;
                axios.post(apis.submit, this.params).then(function(res) {
                    var success = res.data.code === 0;
                    alert(success ? '下单成功' : '下单失败');
                    if (success) {
                        _this.$router.push('/order');
                    }
                });
            }
        }
    };
    var Order = {
        template: '<div><h2>当日订单&nbsp;&nbsp;<router-link to="/">去点餐</router-link></h2><table class="table"><thead><tr><th>姓名</th><th>产品</th><th>数量</th><th>备注</th><th>总价</th><th>操作</th></tr></thead><tbody><tr v-for="(item, index) in list"><td>{{item.name}}</td><td>{{item.product.name}}</td><td>{{item.number}}</td><td>{{item.remark}}</td><td>{{item.price}}</td><td><a class="text-danger" href="javascript:;" v-on:click.prevent="deleteOrder(item.id, index)">删除</a></td></tr><tr><td colspan=6>&nbsp;&nbsp;</td></tr><tr><td>合计</td><td colspan=4 v-html="statistics"></td><td>{{price}}</td></tr></tbody></table></div>',
        data: function () {
            return {
                list: [],
                statistics: '',
                price: 0
            };
        },
        created: function () {
            this.getList();
        },
        methods: {
            getList: function () {
                var _this = this;
                axios.get(apis.orderList).then(function(res) {
                    _this.list = res.data.data;
                    _this.calc();
                });
            },
            deleteOrder: function (id, index) {
                var _this = this;
                var item = this.list[index];
                if (confirm('确定要删除订单【' + item.name + '-' + item.product.name + '】么？')) {
                    axios.post(apis.delete, {id: id}).then(function(res) {
                        if (res.data.code === 0) {
                            _this.list.splice(index, 1);
                            _this.calc();
                        }
                    });
                }
            },
            calc: function () {
                var list = this.list;
                var obj = {};
                var price = 0;
                var arr = [];
                
                list.forEach(function (item) {
                    var product = item.product;
                    if (!obj[product.id]) {
                        obj[product.id] = {
                            name: product.name,
                            count: 0
                        };
                    }
                    obj[product.id].count += item.number;
                    price += item.price;
                });

                for (var key in obj) {
                    arr.push(obj[key].name + ' * ' + obj[key].count);
                }

                this.statistics = arr.join('<br>');
                this.price = price;
            }
        }
    };
    var routes = [
        { path: '/', component: Home },
        { path: '/order', component: Order }
    ];
    var router = new VueRouter({
        routes: routes
    });
    new Vue({
        router: router
    }).$mount('#app');
})();