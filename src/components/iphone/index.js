// import preact
import { h, Component } from 'preact';

import Home from "../home";
import Outfits from "../outfits";
import Search from '../search';
import Settings from '../settings';

import * as config from '../../config.json';

export default class Iphone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			openPanel: "home",
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
			weather: {
				icon: "fas fa-question",
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
				}
			}
		};
		this.parseResponse = this.parseResponse.bind(this);
		this.changePanel = this.changePanel.bind(this);
		this.updateLocation = this.updateLocation.bind(this);
	}

	changePanel(e) {
		console.log(e);
		this.setState({
			openPanel: e.target.dataset['panelName']
		});
	}

	updateLocation(newLocation) {
		this.setState({
			location: {
				icon: "fas fa-question",
				formatted_address: newLocation.target['data-location'],
				geometry: {
					location: {
						lat: config.default_search_results[0].geometry.location.lat,
						lng: config.default_search_results[0].geometry.location.lng
					}
				}
			}
		});
	}

	highlightsIcon(icon) {
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

	parseResponse(parsed_json) {
		console.log(parsed_json);

		let highlightsIcon = this.highlightsIcon(parsed_json['currently']['icon']);
		let weather_summary = parsed_json['currently']['summary'];

		let sun_rise = new Date(parsed_json['daily'].data[0].sunriseTime * 1000).toLocaleTimeString().slice(0,5);
		let sun_set = new Date(parsed_json['daily'].data[0].sunsetTime * 1000).toLocaleTimeString().slice(0,5);

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

		// set states for fields so they could be rendered later on
		this.setState({
			loading: false,
			weather: {
				icon: highlightsIcon,
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
					probability: precip_probability
				}
			}
		});
	}

	weatherError(req, err) {
		console.log(err);
	}

	render() {
		switch (this.state.openPanel) {
			case "home":
				return <Home
							location={this.state.location}
							weather={this.state.weather}
							loading={this.state.loading}
							parseResponse={this.parseResponse}
							changePanel={this.changePanel}
						/>;
			case "outfits":
				return <Outfits />;
			case "search":
				return <Search />;
			case "settings":
				return <Settings />;
			default:
				return <Home weather={this.state.weather} />;
		}
	}
}