const express = require('express');
const axios = require('axios');
const router = express.Router();



// sprawdzanie pogody w miejscu startów
router.get('/', async (req, res) => {
    try {
        // koordynaty miejsc startów rakiet
        const locations = [
            { name: 'floryda', coords: '28.5,-81.0' },
            { name: 'teksas', coords: '31.0,-100.0' },
            { name: 'gujana', coords: '4.9,-52.3' }
        ];
        
        // pobieranie pogody po koordynatach
        const weatherData = {};
        for (const loc of locations) {
            const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${loc.coords.split(',')[0]}&longitude=${loc.coords.split(',')[1]}&current_weather=true`);
            weatherData[loc.name] = response.data.current_weather;
        }
        
        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});




module.exports = router;