const productRouter = require('./route.product');
const customerRouter = require('./route.customer');
const accountRouter = require('./route.user');

function route(app) {
    app.use('/product', productRouter);
    app.use('/customer', customerRouter);
    app.use('/account', accountRouter);
}

module.exports = route;