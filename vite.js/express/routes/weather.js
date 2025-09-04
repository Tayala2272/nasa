const express = require('express');
const axios = require('axios');
const router = express.Router();


let isLoading = false

// Pobieranie pogody dla konkretnych współrzędnych
    router.get('/', async (req, res) => {
        try {
            if(isLoading){return}
            isLoading=true
            const { latitude, longitude } = req.query;
            
            // Walidacja parametrów
            if (!latitude || !longitude || latitude=='Brak danych') {
                isLoading=false
                return res.status(400).json({ error: 'Brak wymaganych parametrów: latitude i longitude' })
            }
            
            // Pobieranie danych pogodowych
            const response = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            )
            
            // Jeśli nie ma danych o pogodzie
            if (!response.data || !response.data.current_weather) {
                isLoading=false
                return res.status(404).json({ error: 'Nie znaleziono danych pogodowych' })
            }
            
            isLoading=false
            res.json(response.data.current_weather)
            
        } catch (error) {
            isLoading=false
            console.error(error)
            
            // Jeśli API zwraca błąd, ale mamy szczegóły
            if (error.response) {
                return res.status(error.response.status).json({ 
                    error: 'Błąd zewnętrznego API', 
                    details: error.response.data 
                })
            }
            
            res.status(500).json({ error: 'Błąd serwera' })
        }
    })




module.exports = router;