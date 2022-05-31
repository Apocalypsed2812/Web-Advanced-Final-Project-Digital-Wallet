const accountRouter = require('./Account');
const adminRouter = require('./Admin');
const userRouter = require('./User');

function route(app){

    //app.use('/book', bookRouter);

    app.use('/', accountRouter);

    app.use('/admin', adminRouter)

    app.use('/user', userRouter)
    
}

module.exports = route;