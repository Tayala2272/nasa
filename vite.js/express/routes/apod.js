const express = require('express');
const axios = require('axios');
const router = express.Router();
const moment = require('moment')


// Zmienna przechowywująca link do zdjęcia w pamięci
    let apod = null
    let lastFetchDate = null



// pobieranie zdjecia z kosmosu dzisiejszego
router.get('/', async (req, res) => {
    try {
        const today = moment().format('YYYY-MM-DD')

        // nowe zdjęcie pobiera się tylko jeśli nie zostało jeszcze dziś pobrane
            if (!apod || lastFetchDate !== today) {
                const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
                
                // Aktualizacja cache
                    apod = response.data.url;
                    lastFetchDate = today;
            }

        res.json({ imageUrl: apod  })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Błąd serwera' })
    }
});

module.exports = router