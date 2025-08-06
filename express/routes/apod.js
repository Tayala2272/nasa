const express = require('express');
const axios = require('axios');
const router = express.Router();



// pobieranie zdjecia z kosmosu dzisiejszego
router.get('/', async (req, res) => {
    try {

        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
        res.json({ imageUrl: response.data.url })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Błąd serwera' })
    }
});

module.exports = router