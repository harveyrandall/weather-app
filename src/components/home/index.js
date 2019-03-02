// import preact
import { h, Component } from 'preact';
import { Link } from 'preact-router';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
import * as config from '../../config.json';
import Search from '../search';


export default class Home extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		this.state = {
			location: {
				city: "London",
				lat: 51,
				lng: 52
			}
		};
	}

	componentDidMount() {
		this.fetchLocation();
	}

	fetchLocation() {
		$.ajax({
			url: "https://extreme-ip-lookup.com/json",
			dataType: "jsonp",
			success: this.fetchWeatherData,
			error: this.locationError
		});
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData(data) {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		if (data.lat !== this.state.lat || data.lon !== this.state.lon) {
			this.setState({
				locate: data.city,
				lat: data.lat,
				lon: data.lon,
				loading: false
			});
		}
		const url = `https://api.darksky.net/forecast/${config.darksky_secret_key}/${this.state.lat},${this.state.lon}`;
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
			// once the data grabbed, hide the button
	}


	parseLocation(data) {
		console.log(data);
	}

	locationError(req, err) {
		console.log("Error getting location");
	}

	weatherError(req, err) {
		console.log(err);
	}

	parseResponse(parsed_json) {
		let temp_c = parsed_json['currently']['temperature'];
		let conditions = parsed_json['currently']['summary'];

		// set states for fields so they could be rendered later on
		this.setState({
			temp: temp_c,
			cond : conditions,
			display: false
		});
	}

	// the main render method for the iphone component
	render() {

		return (
			<div className={style.container}>
				<Header title={this.state.location.city} />
				<main>
					<Section title="Sun & Moon" figure_class="fas fa-sun" />
					<Section title="Wind" figure_class="fas fa-wind" />
					<Section title="Precipitation" figure_class="fas fa-tint" />
				</main>
			</div>
		);
	}
}

const Header = (props) => {
	return (
		<header>
			<div className={style.options}>
				<i className="fa fa-bars" />
			</div>
			<div className={style.title}>
				{props.title}
			</div>
			<div className={style.add}>
				<i className="fa fa-plus" />
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
			<div className={style.section_body}>
				<h5>{props.title}</h5>
				{props.children}
			</div>
		</section>
	);
};
