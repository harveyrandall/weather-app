// import preact
import { h, render, Component } from 'preact';
import { Router, Route, Link } from 'preact-router';

import Home from "../home";
import Search from '../search';

import $ from 'jquery';

export default class Iphone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lat: null,
			lng: null
		}
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
				})
			},
			error: (res, err) => {
				console.log(res);
			}
		});
	}

	render() {
		return (
			<Router>
				<Route path="/" component={Home} />
				<Route path="/search" component={() => <Search lat={this.state.lat} lng={this.state.lng} fetchLocation={this.fetchCurrentLocation}/>} />
			</Router>
		);
	}
}