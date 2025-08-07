import { useState, useEffect } from 'react';
import './App.css'


// Interfaces
	interface NextLaunch {
	rocketName: string;
	imageUrl: string;
	launchSite: string;
	launchTimePL: string;
	launchTimeLocal: string;
	rocketModel: string;
	mission: string;
	}
	interface UpcomingLaunch {
	id: number;
	name: string;
	date: string;
	launchSite: string;
	}
	interface WeatherData {
		temperature: number;
		windspeed: number;
		winddirection: number;
		weathercode: number;
		time: string;
	}




// Api URL
	const API_URL = "http://localhost:3000"

export default function app() {

	const [nextLaunch, setNextLaunch] = useState<NextLaunch | null>(null);
    const [upcomingLaunches, setUpcomingLaunches] = useState<UpcomingLaunch[]>([]);
    const [astronauts, setAstronauts] = useState<string[]>([]);
    const [apodUrl, setApodUrl] = useState<string>('');
    const [times, setTimes] = useState({
        polska: '00:00:00',
        floryda: '00:00:00',
        teksas: '00:00:00',
        gujana: '00:00:00'
    });
	const [weather, setWeather] = useState<WeatherData | null>(null)

    useEffect(() => {
        fetch(API_URL+'/launches/next')
            .then(res => res.json())
            .then(data => setNextLaunch(data));
            
        fetch(API_URL+'/launches/upcoming')
            .then(res => res.json())
            .then(data => setUpcomingLaunches(data));
        
        fetch(API_URL+'/iss')
            .then(res => res.json())
            .then(data => setAstronauts(data));
        
        fetch(API_URL+'/apod')
            .then(res => res.json())
            .then(data => setApodUrl(data.imageUrl));
        
        // czas
        const updateTimes = () => {
            const now = new Date();
            setTimes({
                polska: now.toLocaleTimeString('pl-PL', { timeZone: 'Europe/Warsaw' }),
                floryda: now.toLocaleTimeString('pl-PL', { timeZone: 'America/New_York' }),
                teksas: now.toLocaleTimeString('pl-PL', { timeZone: 'America/Chicago' }),
                gujana: now.toLocaleTimeString('pl-PL', { timeZone: 'America/Cayenne' })
            })
        }
        
        updateTimes()
        const interval = setInterval(updateTimes, 1000)
        return () => clearInterval(interval)
    }, [])




    if (!nextLaunch) return <div>Ładowanie...</div>;




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
			</section>








			{/* następne odloty */}
			<section className="upcoming">
				<h3>Następne odloty</h3>
				<div className="upcoming-list">

					{upcomingLaunches.map(launch => (
						<div key={launch.id} className="upcoming-item">
							<div className="launch-info">
								<div className="info-label">Rakieta:</div>
								<div className="rocket-name">{launch.name}</div>
							</div>
							
							<div className="launch-info">
								<div className="info-label">Data i godzina:</div>
								<div className="launch-date">{launch.date}</div>
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
					{astronauts.map((astronaut, index) => (
						<li key={index} className="astronaut-item">{astronaut}</li>
					))}
				</ul>
			</section>


		</div>
	)
}