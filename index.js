'use strict';

const app = require('./server');

//start server
app.listen(process.env.PORT||8080,() => {
    console.log(`App started at ${process.env.PORT||8080}`);
})