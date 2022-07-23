const connectToMongo = require("./db")
const express = require('express');
// const bodyParser = require('body-parser');
var cors = require('cors')

connectToMongo();
const app = express()
const port = 8000

// to send requests in json
// middleware required
app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// Apis 
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

// demo api
// app.use('/pycomm',require('./routes/Py_js_com'))

app.listen(port, () => {
  console.log(`INote app listening on port ${port}`)
})