// import preact
import { h, Component } from 'preact';

import Home from "../home";
import Outfits from "../outfits";
import Saved from "../saved";
import Search from '../search';
import Settings from '../settings';

import * as config from '../../config.json';

export default class Iphone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openPanel: "home",
			units: "si",
			loading: true,
			timeout: false,
			location: {
				icon: "fas fa-question",
				formatted_address: config.default_search_results[0].formatted_address,
				geometry: {
					location: {
						lat: config.default_search_results[0].geometry.location.lat,
						lng: config.default_search_results[0].geometry.location.lng
					}
				}
			},
			saved_locations: config.default_search_results.slice(0,3),
			weather: {
				icon: "fas fa-question",
				conditions: "",
				summary: "Clear",
				sun: {
					rise: "00:00:00",
					set: "00:00:00"
				},
				temperature: {
					current: 0,
					feelsLike: 0,
					max: 0,
					min: 0
				},
				wind: {
					bearing: 0,
					speed: 0,
					gust_speed: 0
				},
				precipitation: {
					intensity: 0
				},
				week_forecast: [],
				hourly_forecast: []
			}
		};
		this.parseResponse = this.parseResponse.bind(this);
		this.changePanel = this.changePanel.bind(this);
		this.updateLocation = this.updateLocation.bind(this);
		this.addSavedLocation = this.addSavedLocation.bind(this);
		this.changeUnits = this.changeUnits.bind(this);
		this.requestTimeout = this.requestTimeout.bind(this);
	}

	changePanel(e) {
		this.setState({
			openPanel: e.target.dataset['panelName']
		});
	}

	updateLocation(newLocation) {
		this.setState({
			openPanel: 'home',
			location: {
				icon: "fas fa-question",
				formatted_address: newLocation.target.dataset.formattedAddress,
				geometry: {
					location: {
						lat: newLocation.target.dataset.lat,
						lng: newLocation.target.dataset.lng
					}
				}
			}
		});
	}

	iconToFAClasses(icon) {
		switch (icon) {
			case "clear-day":
				return "fas fa-sun";
			case "clear-night":
				return "fas fa-moon";
			case "rain":
				return "fas fa-cloud-rain";
			case "snow":
				return "fas fa-snowflake";
			case "sleet":
				return "fas fa-cloud-rain";
			case "wind":
				return "fas fa-wind";
			case "fog":
				return "fas fa-low-vision";
			case "cloudy":
				return "fas fa-cloud";
			case "partly-cloudy-day":
				return "fas fa-cloud-sun";
			case "partly-cloudy-night":
				return "fas fa-cloud-moon";
			default:
				return "fas fa-question";
		}
	}

	UTCToTimeString(utc, offset) {
		return (new Date((utc*1000) + (offset * 3600000)).toTimeString().slice(0,5));
	}

	parseResponse(parsed_json) {
		console.log(parsed_json);

		let highlightsIcon = this.iconToFAClasses(parsed_json['daily'].data[0]['icon']);
		let weather_summary = parsed_json['daily'].data[0]['summary'];
		let weather_conditions = parsed_json['daily'].data[0]['icon'];

		let sun_rise = this.UTCToTimeString(parsed_json['daily'].data[0].sunriseTime, parsed_json.offset);
		let sun_set = this.UTCToTimeString(parsed_json['daily'].data[0].sunsetTime, parsed_json.offset);

		let current_temp = Math.round(parsed_json['currently']['temperature']);
		let feelslike_temp = Math.round(parsed_json['currently']['apparentTemperature']);
		let max_temp = Math.round(parsed_json['daily'].data[0]['apparentTemperatureMax']);
		let min_temp = Math.round(parsed_json['daily'].data[0]['apparentTemperatureMin']);

		let wind_bearing = parsed_json['currently']['windBearing'];
		let wind_speed = parsed_json['currently']['windSpeed'];
		let wind_gust_speed = parsed_json['currently']['windGust'];

		let precip_type = parsed_json['currently']['precipType'] ? parsed_json['currently']['precipType'].capitalise() : "Precipitation";
		let precip_icon = (parsed_json['currently']['precipType'] === "snow") ? "fas fa-snowflake" : "fas fa-tint";
		let precip_probability = Math.round(parsed_json['currently']['precipProbability'] * 100);
		let precip_intensity = parsed_json['currently']['precipIntensity'];
		let precip_max = parsed_json['daily'].data[0]['precipIntensityMax'];
		let precip_max_time = this.UTCToTimeString(parsed_json['daily'].data[0]['precipIntensityMaxTime'], parsed_json.offset);

		let week_forecast = parsed_json['daily'].data.slice(1);
		let hourly_forecast = parsed_json['hourly'].data.slice(0,24);

		// set states for fields so they could be rendered later on
		this.setState({
			loading: false,
			weather: {
				icon: highlightsIcon,
				conditions: weather_conditions,
				summary: weather_summary,
				sun: {
					rise: sun_rise,
					set: sun_set
				},
				temperature: {
					current: current_temp,
					feelsLike: feelslike_temp,
					max: max_temp,
					min: min_temp
				},
				wind: {
					bearing: wind_bearing,
					speed: wind_speed,
					gust_speed: wind_gust_speed
				},
				precipitation: {
					type: precip_type,
					icon: precip_icon,
					probability: precip_probability,
					intensity: precip_intensity,
					max: precip_max,
					maxTime: precip_max_time
				},
				week_forecast,
				hourly_forecast
			}
		});
	}

	requestTimeout(req, err) {
		console.log(req, err);
		this.setState({
			timeout: true,
			loading: false
		});
	}

	addSavedLocation() {
		let exists = false;
		for (let i = 0; i < this.state.saved_locations.length; i++) {
			if (this.state.location.formatted_address === this.state.saved_locations[i].formatted_address ) {
				exists = true;
				alert('Location already saved');
				break;
			}
		}
		if (!exists) {
			let saved_locations = this.state.saved_locations;
			saved_locations.push(this.state.location);
			this.setState({
				saved_locations
			});
		}
	}

	changeUnits(e) {
		console.log(e);
		this.setState({
			units: e.target.value
		});
	}

	render() {
		switch (this.state.openPanel) {
			case "home":
				return <Home
							location={this.state.location}
							weather={this.state.weather}
							loading={this.state.loading}
							units={this.state.units}
							timeout={this.state.timeout}
							parseResponse={this.parseResponse}
							changePanel={this.changePanel}
							convertIcon={this.iconToFAClasses}
							updateLocation={this.updateLocation}
							requestTimeout={this.requestTimeout}
						/>;
			case "outfits":
				return <Outfits
							conditions={this.state.weather.conditions}
							changePanel={this.changePanel}
						/>;
			case "saved":
				return <Saved
							changePanel={this.changePanel}
							updateLocation={this.updateLocation}
							savedLocations={this.state.saved_locations}
							addSavedLocation={this.addSavedLocation}
						/>;
			case "search":
				return <Search
							changePanel={this.changePanel}
							updateLocation={this.updateLocation}
						/>;
			case "settings":
				return <Settings
							changePanel={this.changePanel}
							changeUnits={this.changeUnits}
							units={this.state.units}
						/>;
			default:
				return <Home
							location={this.state.location}
							weather={this.state.weather}
							units={this.state.units}
							loading={this.state.loading}
							timeout={this.state.timeout}
							parseResponse={this.parseResponse}
							changePanel={this.changePanel}
							convertIcon={this.iconToFAClasses}
							updateLocation={this.updateLocation}
							requestTimeout={this.requestTimeout}
						/>;
		}
	}
}