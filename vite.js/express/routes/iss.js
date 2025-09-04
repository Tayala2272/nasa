const express = require('express');
const axios = require('axios');
const router = express.Router();
const moment = require('moment')

// Zmienna przechowywująca link do zdjęcia w pamięci
    let astronauts = null
    let lastFetchDate = null
    let isLoading = false


// pobieranie listy astronautów w kosmosie
router.get('/', async (req, res) => {
    try {
        if(isLoading){return}
        isLoading = true
        const today = moment().format('YYYY-MM-DD')

        // pobieranie nowej listy astronautów, tylko jeśli dziś jeszcze nie była ona pobrana
            if (astronauts===null || lastFetchDate !== today) {
                const response = await axios.get('http://api.open-notify.org/astros.json')
                astronauts = response.data.people
                    .filter(person => person.craft === 'ISS')
                    .map(person => `${person.name}`)
                    
                lastFetchDate = today
            }    



        isLoading=false
        res.json(astronauts)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});



module.exports = router;