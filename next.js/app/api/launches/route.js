

import { NextResponse } from 'next/server'
import axios from 'axios'
import moment from 'moment-timezone'



// Funkcja pomocnicza do formatowania daty
const formatDate = (dateString, timezone) => {
    if (!dateString) return "Brak daty"
    
    const date = moment(dateString);
    if (!date.isValid()) return "Nieprawidłowa data"
    
    return date.tz(timezone).format('DD.MM.YYYY, HH:mm')
}





// Funkcja do pobierania pogody
const getWeatherData = async (latitude, longitude) => {
    try {
        if (!latitude || !longitude || latitude === 'Brak danych') {
            return { error: 'Brak wymaganych parametrów: latitude i longitude' }
        }
        
        const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        
        if (!response.data || !response.data.current_weather) {
            return { error: 'Nie znaleziono danych pogodowych' }
        }
        
        return response.data.current_weather
    } catch (error) {
        console.error(error)
        return { error: 'Błąd pobierania pogody' }
    }
}





export async function GET() {
    try {
        // Pobieranie danych o startach
            const response = await axios.get(`https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=4`)
            const launches = response.data.results || []

        if (launches.length === 0) {
            return NextResponse.json({ error: 'Brak danych o startach' }, { status: 404 })
        }

        // Przetwarzanie danych o startach
        const processedLaunches = await Promise.all(
            launches.map(async (launch, index) => {
                const timezone = launch.pad?.timezone || 'UTC'
                const launchData = {
                    id: launch.id || `fallback-${Date.now()}-${index}`,
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

                // Dodawanie danych pogodowych tylko dla pierwszego startu
                if (index === 0) {
                    launchData.weather = await getWeatherData(launch.pad?.latitude, launch.pad?.longitude)
                }

                return launchData
            })
        )

        return NextResponse.json(processedLaunches)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 })
    }
}



export const dynamic = 'force-dynamic'; // Wyłącza cache dla tego endpointu