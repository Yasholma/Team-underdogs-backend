import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import users from './routes/users'
import swagger from './swagger.json'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const HTML_FILE = path.join(__dirname, 'index.html')
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 5000

// Base Route
// app.get('/', (req, res) => {
//   res.sendFile(HTML_FILE)
// })

// // Catch 404 Error and Forward to Handler
// app.use((req, res, next) => {
//   const err = new Error('Not Found')
//   err.status = 404
//   next(err)
// })

mongoose
  .connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
  })
  .then(() => console.log('database connected sucessfully'))
  .catch(err => console.log(err))

// Extended - Swagger Docs

// Swagger Docs
app.use('/', swaggerUi.serve, swaggerUi.setup(swagger))

// User Routes
app.use('/api/users', users)

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`)
})
