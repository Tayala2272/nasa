const express = require('express')
const axios = require('axios');
const moment = require('moment-timezone')
const router = express.Router()



// Funkcja pomocnicza do formatowania daty
    const formatDate = (dateString, timezone) => {
        if (!dateString) return "Brak daty"
        
        const date = moment(dateString)
        if (!date.isValid()) return "Nieprawidłowa data"
        
        return date.tz(timezone).format('DD.MM.YYYY, HH:mm')
    }







// zmienne przechowywujące dane o startach rakiet
    let launches = []
    let isUpdating = false


// funkcja pomocniczna aktualizująca dane o staratach
    const updateCache = async () => {
        if (isUpdating) return
        
        isUpdating = true
        try {
            const response = await axios.get(`https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=${4}`)
            launches = response.data.results || []
        } catch (error) {
            console.error('Błąd przy aktualizacji startów:', error)
        } finally {
            isUpdating = false
        }
    }



// funckja pomocnicza sprawdzająca czy potrzebna jest w ogóle aktualizacja danych
    const checkCacheAndUpdateIfNeeded = async () => {

        // jeśli nie ma jeszcze żadnych danych o odlotach, to aktualizuj
            if (!launches || launches.length === 0) {
                await updateCache()
                return
            }



        // jeśli najnowszy start rakiety się odbył, to aktualizuj dane o odlotach
            const firstLaunch = launches[0]
            if (!firstLaunch.net) return

            const now = moment()
            const launchTime = moment(firstLaunch.net)
            if (launchTime.isBefore(now)) {
                updateCache().then(()=>{
                    return
                })
            }
    }








// Najbliższy start
    router.get('/next', async (req, res) => {
        try {
            // sprawdzanie, czy należy odświeżyć informacje
                await checkCacheAndUpdateIfNeeded()


                // Jeśli żadnego lotu nie znalazło to zwraca brak danych
                    if (launches.length === 0) {
                        return res.json({
                            rocketName: "Brak danych",
                            imageUrl: "https://picsum.photos/seed/picsum/200/300",
                            launchSite: "Nieznane miejsce startu",
                            launchTimePL: "Brak daty",
                            launchTimeLocal: "Brak daty",
                            rocketModel: "Nieznany model",
                            mission: "Brak misji",
                            latitude: "Brak danych",
                            longitude: "Brak danych"
                        })
                    }
                
                
                // W przeciwnym razie zwraca wszystkie informacje o locie
                    const launch = launches[0];
                    const timezone = launch.pad?.timezone || 'UTC';
    
                    const nextLaunch = {
                        rocketName: launch.name || "Nieznana rakieta",
                        imageUrl: launch.image || 'https://picsum.photos/seed/picsum/200/300',
                        launchSite: launch.pad?.location?.name || "Nieznane miejsce startu",
                        launchTimePL: formatDate(launch.net, 'Europe/Warsaw'),
                        launchTimeLocal: formatDate(launch.net, timezone) + (launch.net ? ` ${timezone}` : ''),
                        rocketModel: launch.rocket?.configuration?.full_name || "Nieznany model",
                        mission: launch.mission?.name || 'Brak misji',
                        latitude: launch.pad?.latitude || "Brak danych",
                        longitude: launch.pad?.longitude || "Brak danych"
                    }
    
                    res.json(nextLaunch)
            


        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Błąd serwera' })
        }
    })





// Kolejne starty (pomijając najbliższy)
    router.get('/upcoming', async (req, res) => {
        try {
            // sprawdzanie, czy należy odświeżyć informacje
                await checkCacheAndUpdateIfNeeded()
                
            
            // Pomijamy pierwszy start, bo najbliższy start zwraca route /next
                const upcomingLaunches = launches.slice(1).map((launch, index) => ({
                    id: launch.id || `fallback-${Date.now()}-${index}`,
                    name: launch.name || "Nieznana rakieta",
                    date: formatDate(launch.net, 'Europe/Warsaw'),
                    launchSite: launch.pad?.location?.name || "Nieznane miejsce startu"
                }))

            res.json(upcomingLaunches);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Błąd serwera' });
        }
    })


module.exports = router