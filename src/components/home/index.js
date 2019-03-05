// import preact
import { h, Component } from 'preact';
import { Link } from 'preact-router';
// import stylesheets for ipad & button
import style from './style';
// import jquery for API calls
import $ from 'jquery';
import * as config from '../../config.json';
import Search from '../search';
import Settings from '../settings';
import Outfits from '../outfits';

String.prototype.capitalise = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

export default class Home extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			optionsPaneOpen: true,
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
				icon: "",
				summary: "",
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
		this.toggleOptionsPane = this.toggleOptionsPane.bind(this);
	}

	componentDidMount() {
		//this.fetchWeatherData();
	}

	// a call to fetch weather data via dark sky
	fetchWeatherData() {
		const url = `https://api.darksky.net/forecast/${config.darksky_secret_key}/${this.state.location.geometry.location.lat},${this.state.location.geometry.location.lng}`;
		$.ajax({
			url,
			data: {
				lang: "en",
				units: 'si'
			},
			dataType: "jsonp",
			success : this.parseResponse,
			error : this.weatherError
		});
	}


	parseLocation(data) {
		console.log(data);
	}

	locationError(req, err) {
		console.log("Error getting location", err);
	}

	weatherError(req, err) {
		console.log(err);
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

	changePanel(e) {
		this.setState({
			openPanel: e.target.dataset['panelName']
		});
	}

	toggleOptionsPane() {
		this.setState({
			optionsPaneOpen: !this.state.optionsPaneOpen
		});
	}

	// the main render method for the iphone component
	render() {
		let arrowTransform = `shrink-6 rotate-${this.state.weather.wind.bearing}`;
		let loadingClasses = this.state.loading ? style.loading : [style.loading, style.hide].join(' ');

		const homeDisplay = (
			<div className={style.container}>
				<Options isOpen={this.state.optionsPaneOpen} toggleOptionsPane={this.toggleOptionsPane} />
				<div className={loadingClasses}>
					<i class="fas fa-spinner fa-pulse fa-2x" style="align-self: center;"/>
				</div>
				<Header title={this.state.location.formatted_address} changePanel={this.changePanel} toggleOptionsPane={this.toggleOptionsPane} />
				<main>
					<aside class={style.glance}>
						<div class={style.glance_icon}>
							<i class={this.state.weather.icon} />
						</div>
						<div class={style.glance_sun}>
							<p>
								<span class="fa-layers fa-fw" style="font-size:30pt; vertical-align: middle;">
									<i class="fas fa-sun" data-fa-transform="shrink-6" />
									<i class="fas fa-arrow-up" data-fa-transform="shrink-12 up-8" />
								</span>
								{this.state.weather.sun.rise}
							</p>
							<p>
								<span class="fa-layers fa-fw" style="font-size:30pt; vertical-align: middle;">
									<i class="fas fa-sun" data-fa-transform="shrink-6" />
									<i class="fas fa-arrow-down" data-fa-transform="shrink-12 up-8" />
								</span>
								{this.state.weather.sun.set}
							</p>
						</div>
						<div>{this.state.weather.summary}</div>
					</aside>
					<Section title="Temperature" figure_class="fas fa-thermometer-three-quarters">
						<div className={style.focus}>
							{this.state.weather.temperature.current}°
						</div>
						<div className={style.details}>
							<div>Feels Like: {this.state.weather.temperature.feelsLike}°</div>
							<div>Max: {this.state.weather.temperature.max}°</div>
							<div>Min: {this.state.weather.temperature.min}°</div>
						</div>
					</Section>
					<Section title="Wind" figure_class="fas fa-wind">
						<div className={style.focus} style="margin-left:-5px;margin-right:5px;">
							<span class="fa-layers fa-fw">
								<i class="fas fa-circle" style="color:#5F6C74" />
								<i class="fa-inverse fas fa-arrow-up" data-fa-transform={arrowTransform} />
							</span>
						</div>
						<div className={style.details}>
							<div>Wind Speed: {this.state.weather.wind.speed}</div>
							<div>Gust Speed: {this.state.weather.temperature.max}</div>
							<div>Bearing: {this.state.weather.wind.bearing}° N</div>
						</div>
					</Section>
					<Section title={this.state.weather.precipitation.type} figure_class="fas fa-tint">
						<div className={style.focus}>
							{this.state.weather.precipitation.probability}<span style="font-size:smaller;">%</span>
						</div>
						<div className={style.details}>
							<div>Wind Speed: {this.state.weather.precipitation.intensity}</div>
							<div>Gust Speed: {this.state.weather.temperature.max}</div>
							<div>Bearing: {this.state.weather.wind.bearing}</div>
						</div>
					</Section>
				</main>
			</div>
		);

		return homeDisplay;
	}
}

const Header = (props) => {
	return (
		<header class={style.home_header}>
			<div className={style.options} onClick={props.toggleOptionsPane} data-panel-name="list">
				<i className="fa fa-bars" data-panel-name="list" />
			</div>
			<div className={style.title}>
				{props.title}
			</div>
			<div className={style.add} onClick={props.changePanel} data-panel-name="search">
				<i className="fa fa-search" data-panel-name="search" />
			</div>
		</header>
	);
};

const Section = (props) => {
	return (
		<section>
			<div className={style.section_figure}>
				<i className={props.figure_class} />
			</div>
			<div className={style.section_content}>
				<h5 className={style.section_title}>{props.title}</h5>
				<div className={style.section_body}>
					{props.children}
				</div>
			</div>
		</section>
	);
};

const Options = (props) => {
	let classes = props.isOpen ? style.options_pane : [style.options_pane, style.hide_options].join(' ');

	return (
		<div class={classes}>
			<header class={style.options_header}>
				Options
				<span onClick={props.toggleOptionsPane} style="cursor:pointer;">
					<i class="fas fa-arrow-right" onClick={props.toggleOptionsPane} />
				</span>
			</header>
		</div>
	);
};
