// Declare dependencies.

require('dotenv').config()
require('app-module-path').addPath('./')

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const graphqlHTTP = require('express-graphql')
const graphQLSchema = require('gql-schema')

// Database connection.

mongoose.connection.once('open', () => console.log(`API now connected to MongoDB database.`))
mongoose.connection.on('error', (error) => console.log(error))
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Use middlewares.

app.use(cors())
app.use('/graphql', graphqlHTTP({ schema: graphQLSchema, graphiql: true }))

// Server initialization.

app.listen(process.env.PORT || 5000, () => {
    console.log(`Now listening for requests on port ${process.env.PORT || 5000}.`)
})