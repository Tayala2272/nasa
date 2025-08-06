
import './App.css'

export default function app() {


	

	const nextLaunch = {
		rocketName: "Falcon 9",
		imageUrl: "https://picsum.photos/200/300",
		launchSite: "Kennedy Space Center, Floryda",
		launchTimePL: "6.10.2023, 14:30 CEST",
		launchTimeLocal: "6.10.2023, 08:30 EDT",
		rocketModel: "Falcon 9 Block 5",
		mission: "Wyniesienie satelitów Starlink"
	};

	const upcomingLaunches = [
		{ 
			id: 1, 
			name: "Starship", 
			date: "12.10.2023, 16:00",
			launchSite: "Boca Chica, Teksas" 
		},
		{ 
			id: 2, 
			name: "Atlas V", 
			date: "15.10.2023, 11:20",
			launchSite: "Cape Canaveral, Floryda" 
		},
		{ 
			id: 3, 
			name: "Soyuz MS-25", 
			date: "18.10.2023, 09:45",
			launchSite: "Bajkonur, Kazachstan" 
		}
	];

	const astronauts = [
		"Jasmin Moghbeli (NASA)",
		"Andreas Mogensen (ESA)",
		"Satoshi Furukawa (JAXA)",
		"Konstantin Borisov (Roskosmos)"
	];

	return (
		<div className="app">




			{/* godziny */}
			<section className="time-section">
				<h3>Czas:</h3>
				<div>
					<div className="time-item">
						<div className="location">Polska:</div>
						<div className="time">11:22:32</div>
					</div>
					<div className="time-item">
						<div className="location">Spacex + NASA, Floryda:</div>
						<div className="time">06:22:32</div>
					</div>
					<div className="time-item">
						<div className="location">Spacex, Teksas:</div>
						<div className="time">06:52:32</div>
					</div>
					<div className="time-item">
						<div className="location">ESA, Gujana Francuska:</div>
						<div className="time">7:22:32</div>
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
					src="https://picsum.photos/500/1000" 
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