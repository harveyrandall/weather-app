// import preact
import { h, render, Component } from 'preact';
import { Router, Route, Link } from 'preact-router';
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
		this.setState({
			loading: true
		});
	}

	componentDidMount = () => {
		this.fetchLocation();
	}

	fetchLocation = () => {
		$.ajax({
			url: "https://extreme-ip-lookup.com/json",
			dataType: "jsonp",
			success: this.fetchWeatherData,
			error: this.locationError
		});
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = (data) => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		if(data.lat != this.state.lat || data.lon != this.state.lon) {
			this.setState({
				locate: data.city,
				lat: data.lat,
				lon: data.lon,
				loading: false
			});
		}
		var url = `https://api.darksky.net/forecast/${config.darksky_secret_key}/${this.state.lat},${this.state.lon}`;
		$.ajax({
			url: url,
			data: {
				lang: "en",
				units: 'si'
			},
			dataType: "jsonp",
			success : this.parseResponse,
			error : this.weatherError
		})
			// once the data grabbed, hide the button
	}

	// the main render method for the iphone component
	render() {
		let loading = undefined;
		if (this.state.loading) {
			loading = <div class={style.loading}><i class="fas fa-spinner fa-pulse"></i></div>;
		}
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;

		// display all weather data
		return (
			<div class={ style.container }>
				{loading}
				<div class={ style.header }>
					<Link href={Search}>Search</Link>
					<div class={ style.city }>{ this.state.locate }</div>
					<div class={ style.conditions }>{ this.state.cond }</div>
					<span class={ tempStyles }>{ this.state.temp }</span>
				</div>
				<div class={ style.details }></div>
				<div class= { style_iphone.container }>
					{ this.state.display ? <Button class={ style_iphone.button } clickFunction={ this.fetchLocation }/ > : <Button class={style_iphone.button} clickFunction={this.fetchLocation } text='refresh' /> }
				</div>
			</div>
		);
	}

	parseLocation = (data) => {
		console.log(data);
	}

	locationError = (req, err) => {
		console.log("Error getting location");
	}

	weatherError = (req, err) => {
		console.log(err);
	}

	parseResponse = (parsed_json) => {
		let temp_c = parsed_json['currently']['temperature'];
		let conditions = parsed_json['currently']['summary'];

		// set states for fields so they could be rendered later on
		this.setState({
			temp: temp_c,
			cond : conditions,
			display: false
		});
	}
}
