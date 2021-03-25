const express = require("express");
const bp = require('body-parser')
const transactionRouter = require('./routers/transaction');
const app = express();


app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))


   
app.use('/api',transactionRouter);
    
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

