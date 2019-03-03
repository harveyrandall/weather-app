// import preact
import { h, Component } from 'preact';
import { Router, Route, Link } from 'preact-router';

import Home from "../home";
import Search from '../search';
import Settings from '../settings';

import $ from 'jquery';
import * as config from '../../config.json';

export default class Iphone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			location: config.default_search_results[0]
		};
		this.fetchCurrentLocation = this.fetchCurrentLocation.bind(this);
	}

	componentDidMount() {
		this.fetchCurrentLocation();
	}

	fetchCurrentLocation() {
		$.ajax({
			url: "https://extreme-ip-lookup.com/json",
			dataType: "jsonp",
			success: (data) => {
				this.setState({
					lat: data.lat,
					lng: data.lon
				});
			},
			error: (res, err) => {
				console.log(res, err);
			}
		});
	}

	render() {

		switch (this.state.openPanel) {
			case "home":
				return homeDisplay;
			case "search":
				return <Search />;
			case "list":
				return <List />;
			case "settings":
				return <Settings />;
			default:
				return homeDisplay;
		}		return (
			<Router>
				<Route path="/" component={Home} />
				<Route path="/search" component={() => <Search lat={this.state.lat} lng={this.state.lng} fetchLocation={this.fetchCurrentLocation}/>} />
			</Router>
		);
	}
}