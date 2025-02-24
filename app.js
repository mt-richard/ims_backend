const express = require('express')  
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 4500

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

// main routes
app.use('/auth', require('./routes/auth'))
app.use('/users', require('./routes/users'))
app.use('/locations', require('./routes/locations'))
app.use('/suppliers', require('./routes/suppliers'))
app.use('/item_category', require('./routes/item_category'))
app.use('/sub_category', require('./routes/sub_category'))
app.use('/divisions', require('./routes/divisions'))
app.use('/item_master', require('./routes/item_master'))
app.use('/stock_movement', require('./routes/stock_movement'))
app.use('/adjust_reason', require('./routes/adjust_reason'))
app.use('/stock_adjustment', require('./routes/stock_adjustment'))
app.use('/purchase_entry', require('./routes/purchase_entry'))
app.use('/item_transaction', require('./routes/item_transaction'))
app.use('/stock_movements', require('./routes/stock_movements'))
app.use('/item_assign', require('./routes/item_assign'))
app.use('/item_details', require('./routes/item_details'))

app.get('/', (req, res) =>{
    res.send('Welcome to ABG I.T Inventory MS API.');
});

app.listen(port, function(){
    console.log(`Welcome to ABG I.T Inventory MS API.\nListening on http://localhost:${port}`)
})