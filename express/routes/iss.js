const express = require('express');
const axios = require('axios');
const router = express.Router();




// pobieranie listy astronautów w kosmosie
router.get('/', async (req, res) => {
    try {

        const response = await axios.get('http://api.open-notify.org/astros.json');
        const astronauts = response.data.people
            .filter(person => person.craft === 'ISS')
            .map(person => `${person.name}`);
        
            
        res.json(astronauts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});



module.exports = router;