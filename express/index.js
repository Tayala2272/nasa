require('dotenv').config()
const express = require('express')


// Routes
    const launches = require('./routes/launches')
    const apod = require('./routes/apod')
    const iss = require('./routes/iss')
    const weather = require('./routes/weather')


const app = express()


// Routes
    app.use('/launches', launches)
    app.use('/apod', apod)
    app.use('/iss', iss)
    app.use('/weather', weather)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`)
})