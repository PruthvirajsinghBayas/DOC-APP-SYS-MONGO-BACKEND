const  express = require('express')
require('dotenv').config()
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const userRoute = require('./routes/userRoute')
const docRoute = require('./routes/doctorRoute')


const app = express()
const port = process.env.PORT || 7000


app.use(express.json())
app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))

app.use('/api/user', userRoute)
app.use('/api/doc', docRoute)

// http://localhost:7005/api/user/register


app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))