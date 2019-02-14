// import preact
import { h, render, Component } from 'preact';
import { Router, Route, Link } from 'preact-router';

import Home from "../home";
import Search from '../search';

export default class Iphone extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<Router>
				<Route path="/" component={Home} />
				<Route path="/search" component={() => <Search location="London" />} />
			</Router>
		);
	}
}