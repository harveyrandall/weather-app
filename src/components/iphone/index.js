// import preact
import { h, render, Component } from 'preact';
import { Router, Route, Link } from 'preact-router';

import Home from "../home";
import Search from '../search';

import $ from 'jquery';

export default class Iphone extends Component {
	constructor() {
		super();
	}

	componentDidMount() {
		this.fetchLocation();
	}

	fetchLocation() {
		$.ajax({
			url: "https://extreme-ip-lookup.com/json",
			dataType: "jsonp",
			success: (data) => {
				this.setState({
					city: data.city
				})
			},
			error: (res, err) => {
				alert(err);
			}
		});
	}



	render() {
		return (
			<Router>
				<Route path="/" component={Home} />
				<Route path="/search" component={() => <Search location={this.state.city} />} />
			</Router>
		);
	}
}