(() => {
    const apiBase = 'https://milk.leanapp.cn/api';
    const apis = {
        productList: `${apiBase}/product/list`,
        submit: `${apiBase}/order/submit`,
        orderList: `${apiBase}/order/list`
    };
    const Home = {
        template: `
            <div>
                <h2>点餐</h2>
                <form class="form" v-on:submit.prevent="order()">
                    <div class="flex-left units-gap">
                        <label class="unit-0 text-right" for="multiple-inputs-name" style="width:85px;">产品: </label>
                        <div class="unit">
                            <select v-model="params.productId" required>
                                <option v-for="item in list" v-bind:value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex-left units-gap">
                        <label class="unit-0 text-right" for="multiple-inputs-name" style="width:85px;">数量: </label>
                        <div class="unit">
                            <input type="number" name="number" v-model.number="params.number" placeholder="产品数量" required/>
                        </div>
                    </div>
                    <div class="flex-left units-gap">
                        <label class="unit-0 text-right" for="multiple-inputs-name" style="width:85px;">姓名: </label>
                        <div class="unit">
                            <input type="text" name="name" v-model="params.name" placeholder="姓名" required/>
                        </div>
                    </div>
                    <div class="flex-left units-gap">
                        <label class="unit-0 text-right" for="multiple-inputs-name" style="width:85px;">备注: </label>
                        <div class="unit">
                            <input type="text" name="remark" v-model="params.remark" placeholder="备注"/>
                        </div>
                    </div>
                    <div class="flex-left">
                        <button type="submit" class="btn btn-primary">下单</button>
                    </div>
                </form>
            </div>
        `,
        data() {
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
                axios.get(apis.productList).then(res => {
                    this.list = res.data.data;
                });
            },
            order: function () {
                axios.post(apis.submit, this.params).then(res => {
                    alert(res.data.code === 0 ? '下单成功' : '下单失败');
                });
            }
        }
    };
    const Order = {
        template: `
            <div>
                <h2>当日订单</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>姓名</th>
                            <th>产品</th>
                            <th>数量</th>
                            <th>备注</th>
                            <th>总价</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list">
                            <td>{{item.name}}</td>
                            <td>{{item.product.name}}</td>
                            <td>{{item.number}}</td>
                            <td>{{item.remark}}</td>
                            <td>{{item.price}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `,
        data() {
            return {
                list: []
            };
        },
        created: function () {
            this.getList();
        },
        methods: {
            getList: function () {
                axios.get(apis.orderList).then(res => {
                    this.list = res.data.data;
                });
            }
        }
    };

    const routes = [
        { path: '/', component: Home },
        { path: '/order', component: Order }
    ];

    const router = new VueRouter({
        routes
    });
    new Vue({
        router
    }).$mount('#app');
})();