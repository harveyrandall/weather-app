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
		this.state = {
			savedPaneOpen: false
		};
		this.toggleSavedPane = this.toggleSavedPane.bind(this);
	}

	componentDidMount() {
		this.fetchWeatherData();
	}

	// a call to fetch weather data via dark sky
	fetchWeatherData() {
		const url = `https://api.darksky.net/forecast/${config.darksky_secret_key}/${this.props.location.geometry.location.lat},${this.props.location.geometry.location.lng}`;
		$.ajax({
			url,
			data: {
				lang: "en",
				units: 'si'
			},
			dataType: "jsonp",
			success : this.props.parseResponse,
			error : this.weatherError
		});
	}

	toggleSavedPane() {
		this.setState({
			savedPaneOpen: !this.state.savedPaneOpen
		});
	}

	// the main render method for the iphone component
	render() {
		let arrowTransform = `shrink-6 rotate-${this.props.weather.wind.bearing}`;
		let loadingClasses = this.props.loading ? style.loading : [style.loading, style.hide].join(' ');
		let saved = this.state.savedPaneOpen ? <Saved toggleSavedPane={this.toggleSavedPane} /> : "";

		return (
			<div className={style.container}>
				{saved}
				<div className={loadingClasses}>
					<i class="fas fa-spinner fa-pulse fa-2x" style="align-self: center;"/>
				</div>
				<Header title={this.props.location.formatted_address} changePanel={this.props.changePanel} toggleOptionsPane={this.toggleSavedPane} />
				<main>
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
					<Section title="Temperature" figure_class="fas fa-thermometer-three-quarters">
						<div className={style.focus}>
							{this.props.weather.temperature.current}°
						</div>
						<div className={style.details}>
							<div>Feels Like: {this.props.weather.temperature.feelsLike}°</div>
							<div>Max: {this.props.weather.temperature.max}°</div>
							<div>Min: {this.props.weather.temperature.min}°</div>
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
							<div>Wind Speed: {this.props.weather.wind.speed}</div>
							<div>Gust Speed: {this.props.weather.temperature.max}</div>
							<div>Bearing: {this.props.weather.wind.bearing}° N</div>
						</div>
					</Section>
					<Section title={this.props.weather.precipitation.type} figure_class="fas fa-tint">
						<div className={style.focus}>
							{this.props.weather.precipitation.probability}<span style="font-size:smaller;">%</span>
						</div>
						<div className={style.details}>
							<div>Wind Speed: {this.props.weather.precipitation.intensity}</div>
							<div>Gust Speed: {this.props.weather.temperature.max}</div>
							<div>Bearing: {this.props.weather.wind.bearing}</div>
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
			<div className={style.options} onClick={props.toggleOptionsPane}>
				<i className="fa fa-bars" />
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

const Saved = (props) => {
	return (
		<aside class={style.saved_pane}>
			<header class={style.saved_header}>
				Saved Locations
				<span onClick={props.toggleSavedPane} style="cursor:pointer;">
					<i class="fas fa-times" />
				</span>
			</header>
			<div class={style.panel_buttons}>
				<div class={style.saved_locations}>
					{config.default_search_results.slice(0,3).map((val) => {
						return (
							<div class={style.option} data-location={val.formatted_address} data-lat={val.geometry.location.lat} data-lng={val.geometry.location.lng}>
								{val.formatted_address}
							</div>
						);
					})}
					<div class={style.option}>
						<i class="fas fa-plus" />
					</div>
				</div>
				<div class={style.bottom_buttons}>
					<div class={style.bottom_option}><i class="fas fa-cog" /></div>
					<div class={style.bottom_option}>Help</div>
				</div>
			</div>
		</aside>
	);
};