// import preact
import { h, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
// import jquery for API calls
import $ from 'jquery';
import * as config from '../../config.json';

String.prototype.capitalise = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

export default class Home extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		this.selectSavedLocation = this.selectSavedLocation.bind(this);
		this.fetchWeatherData = this.fetchWeatherData.bind(this);
	}

	componentDidMount() {
		this.fetchWeatherData();
	}

	// a call to fetch weather data via dark sky
	fetchWeatherData() {
		const units = this.props.units;
		const url = `https://api.darksky.net/forecast/${config.darksky_secret_key}/${this.props.location.geometry.location.lat},${this.props.location.geometry.location.lng}`;
		$.ajax({
			url,
			data: {
				lang: "en",
				units
			},
			dataType: "jsonp",
			success : this.props.parseResponse,
			error : this.props.requestTimeout,
			timeout: 10000
		});
	}

	selectSavedLocation(e) {
		this.props.updateLocation(e);
	}

	// the main render method for the iphone component
	render() {
		let arrowTransform = `shrink-6 rotate-${this.props.weather.wind.bearing}`;
		let loadingClasses = this.props.loading ? style.loading : [style.loading, style.hide].join(' ');
		let speed_units = this.props.units === "si" ? "MPH" : "KPH";
		let temp_units = this.props.units === "si" ? "C" : "F";
		let timeout = !this.props.timeout ? "display:none;" : "";

		return (
			<div className={style.container}>
				<div className={loadingClasses}>
					<i class="fas fa-spinner fa-pulse fa-2x" style="align-self: center;"/>
				</div>
				<Header title={this.props.location.formatted_address} changePanel={this.props.changePanel} toggleOptionsPane={this.toggleSavedPane} />
				<main>
					<div class="alert alert-danger" role="alert" style={timeout} onClick={this.fetchWeatherData}>
						Cannot get weather data right now. <br /> Click here to try again.
					</div>
					<aside class={style.glance}>
						<div class={style.glance_icon}>
							<i class={this.props.weather.icon} />
						</div>
						<div class={style.glance_sun}>
							<p>
								<span class="fa-layers fa-fw" style="font-size:30pt; vertical-align: middle;">
									<i class="fas fa-sun" data-fa-transform="shrink-6" />
									<i class="fas fa-arrow-up" data-fa-transform="shrink-12 up-8" />
								</span>
								{this.props.weather.sun.rise}
							</p>
							<p>
								<span class="fa-layers fa-fw" style="font-size:30pt; vertical-align: middle;">
									<i class="fas fa-sun" data-fa-transform="shrink-6" />
									<i class="fas fa-arrow-down" data-fa-transform="shrink-12 up-8" />
								</span>
								{this.props.weather.sun.set}
							</p>
						</div>
						<div class={style.glance_summary}>{this.props.weather.summary}</div>
					</aside>
					<Section title="Wind" figure_class="fas fa-wind">
						<div className={style.focus} style="margin-left:-5px;margin-right:5px;">
							<span class="fa-layers fa-fw">
								<i class="fas fa-circle" style="color:#5F6C74" />
								<i class="fa-inverse fas fa-arrow-up" data-fa-transform={arrowTransform} />
							</span>
						</div>
						<div className={style.details}>
							<div>Wind Speed: {this.props.weather.wind.speed} {speed_units}</div>
							<div>Gust Speed: {this.props.weather.temperature.max} {speed_units}</div>
							<div>Bearing: {this.props.weather.wind.bearing}° N</div>
						</div>
					</Section>
					<Section title="Temperature" figure_class="fas fa-thermometer-three-quarters">
						<div className={style.focus}>
							{this.props.weather.temperature.current}°{temp_units}
						</div>
						<div className={style.details}>
							<div>Feels Like: {this.props.weather.temperature.feelsLike}°{temp_units}</div>
							<div>Max: {this.props.weather.temperature.max}°{temp_units}</div>
							<div>Min: {this.props.weather.temperature.min}°{temp_units}</div>
						</div>
					</Section>
					<Section title={this.props.weather.precipitation.type} figure_class="fas fa-tint">
						<div className={style.focus}>
							{this.props.weather.precipitation.probability}<span style="font-size:smaller;">%</span>
						</div>
						<div className={style.details}>
							<div>Intensity: {this.props.weather.precipitation.intensity} in/hour</div>
							<div>Peak: {this.props.weather.precipitation.max} in/hour</div>
							<div>Peak time: {this.props.weather.precipitation.maxTime}</div>
						</div>
					</Section>
					<WeekForecast forecast={this.props.weather.week_forecast} convertIcon={this.props.convertIcon} />
					<HourlyForecast forecast={this.props.weather.hourly_forecast} convertIcon={this.props.convertIcon} />
				</main>
			</div>
		);
	}
}

const Header = (props) => {
	return (
		<header class={style.home_header}>
			<div className={style.options} onClick={props.changePanel} data-panel-name="saved" >
				<i className="fa fa-bars" data-panel-name="saved" />
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

const WeekForecast = (props) => {
	props.forecast.map((val) => {
		val.icon = props.convertIcon(val.icon);
	});
	return (
		<section className={style.week_forecast}>
			<div class={style.days}>
				{props.forecast.map((val) => {
					return (<div className={style.forecast_day}>
						<h6>{new Date(val.time * 1000).toGMTString().slice(0,3)}</h6>
						<i class={val.icon} />
						{val.apparentTemperatureMax}°
					</div>);
				})}
			</div>
			<div class={style.more}>
				<i class="fas fa-arrow-right" />
			</div>
		</section>
	);
};

const HourlyForecast = (props) => {
	props.forecast.map((val) => {
		val.icon = props.convertIcon(val.icon);
	});
	return (
		<section className={style.week_forecast}>
			<div class={style.days}>
				{props.forecast.map((val) => {
					return (<div className={style.forecast_day}>
						<h6>{new Date(val.time * 1000).toGMTString().slice(17,22)}</h6>
						<i class={val.icon} />
						{val.temperature}°
					</div>);
				})}
			</div>
			<div class={style.more}>
				<i class="fas fa-arrow-right" />
			</div>
		</section>
	);
};