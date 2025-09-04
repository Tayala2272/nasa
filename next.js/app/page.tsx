



import './page.css'



// Interfaces
    interface LaunchData {
        id: string;
        rocketName: string;
        imageUrl: string;
        launchSite: string;
        launchTimePL: string;
        launchTimeLocal: string;
        rocketModel: string;
        mission: string;
        latitude: string;
        longitude: string;
        weather?: {
            temperature: number;
            windspeed: number;
            winddirection: number;
            weathercode: number;
            time: string;
        }
    }

    interface Astronaut {
        name: string
    }








async function getData() {
    try {
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://your-production-domain.com' 
            : 'http://localhost:3000'

        const [launchesRes, astronautsRes, apodRes] = await Promise.all([
            fetch(`${baseUrl}/api/launches`),
            fetch(`${baseUrl}/api/iss`),
            fetch(`${baseUrl}/api/apod`)
        ])

        if (!launchesRes.ok || !astronautsRes.ok || !apodRes.ok) {
            throw new Error('Failed to fetch data')
        }

        const launches = await launchesRes.json()
        const astronauts = await astronautsRes.json()
        const apod = await apodRes.json()

        const now = new Date();
        const times = {
            polska: now.toLocaleTimeString('pl-PL', { timeZone: 'Europe/Warsaw' }),
            floryda: now.toLocaleTimeString('pl-PL', { timeZone: 'America/New_York' }),
            teksas: now.toLocaleTimeString('pl-PL', { timeZone: 'America/Chicago' }),
            gujana: now.toLocaleTimeString('pl-PL', { timeZone: 'America/Cayenne' })
        }

        return {
        launches,
        astronauts,
        apodUrl: apod.imageUrl,
        times
        };
    } catch (error) {
        console.error('Error fetching data:', error)
        throw new Error('Failed to fetch data')
    }
}






export default async function App() {


    const { launches, astronauts, apodUrl, times } = await getData()
    const nextLaunch = launches[0]
    const upcomingLaunches = launches.slice(1)

    return (
        <div className="app">
            {/* godziny */}
            <section className="time-section">
                <h3>Godziny:</h3>
                <div>
                    <div className="time-item">
                        <div className="location">Polska:</div>
                        <div className="time">{times.polska}</div>
                    </div>
                    <div className="time-item">
                        <div className="location">Spacex + NASA, Floryda:</div>
                        <div className="time">{times.floryda}</div>
                    </div>
                    <div className="time-item">
                        <div className="location">Spacex, Teksas:</div>
                        <div className="time">{times.teksas}</div>
                    </div>
                    <div className="time-item">
                        <div className="location">ESA, Gujana Francuska:</div>
                        <div className="time">{times.gujana}</div>
                    </div>
                </div>
            </section>

            {/* najbliższy odlot */}
            <section className="next-launch">
                <h3>Najbliższy odlot rakiety</h3>
                <div className="launch-content">
                    <img 
                        src={nextLaunch.imageUrl} 
                        alt={nextLaunch.rocketName} 
                        className="rocket-image"
                    />
                    <div className="launch-details">
                        <p><span>Rakieta:</span> {nextLaunch.rocketName}</p>
                        <p><span>Start z:</span> {nextLaunch.launchSite}</p>
                        <p><span>Czas startu (PL):</span> {nextLaunch.launchTimePL}</p>
                        <p><span>Czas lokalny:</span> {nextLaunch.launchTimeLocal}</p>
                        <p><span>Model:</span> {nextLaunch.rocketModel}</p>
                        <p><span>Misja:</span> {nextLaunch.mission}</p>
                    </div>
                </div>

                {/* pogoda w miejscu startu */}
                <div className="weather-info">
                    <h3>Aktualna pogoda w miejscu startu:</h3>
                    {nextLaunch.weather ? (
                        <>
                        <p>Temperatura: {nextLaunch.weather.temperature} °C</p>
                        <p>Prędkość wiatru: {nextLaunch.weather.windspeed} km/h</p>
                        <p>Kierunek wiatru: {nextLaunch.weather.winddirection}°</p>
                        </>
                    ) : (
                        <p>Brak danych pogodowych</p>
                    )}
                </div>
            </section>

            {/* następne odloty */}
            <section className="upcoming">
                <h3>Następne odloty</h3>
                <div className="upcoming-list">
                    {upcomingLaunches.map((launch: LaunchData) => (
                        <div key={launch.id} className="upcoming-item">
                            <div className="launch-info">
                                <div className="info-label">Rakieta:</div>
                                <div className="rocket-name">{launch.rocketName}</div>
                            </div>
                            
                            <div className="launch-info">
                                <div className="info-label">Data i godzina:</div>
                                <div className="launch-date">{launch.launchTimePL}</div>
                            </div>
                            
                            <div className="launch-info">
                                <div className="info-label">Start z:</div>
                                <div className="launch-site">{launch.launchSite}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sekcja Zdjęcie dnia */}
            <section className="today-image">
                <h3>Dzisiejsze zdjęcie z kosmosu</h3>
                <p>Nasa każdego dnia publikuje jedno zdjęcie z kosmosu i udostępnia to zdjęcie ludzią na całym świecie</p>
                <img 
                    src={apodUrl}
                    alt="zdjęcie kosmosu" 
                    className="space-image"
                />
            </section>

            {/* Sekcja ISS */}
            <section className="iss">
                <h3>Lista astronautów przebywających aktualnie na Międzynarodowej Stacji Kosmicznej</h3>
                <ul>
                    {astronauts.map((astronaut: Astronaut, index: number) => (
                        <li key={index} className="astronaut-item">{astronaut.name}</li>
                    ))}
                </ul>
            </section>
        </div>
    )
}