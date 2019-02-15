'use strict'
// import preact
import { h, render, Component } from 'preact';
import { Link } from 'preact-router';

// import stylesheets for ipad & button
import style from './style';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
import style_iphone from '../button/style_iphone';
import * as config from '../../config.json';

export default class Search extends Component {

	// a constructor with initial set states
	constructor(props){
		super(props);
		this.timeout = null;
		this.state = {
			lat: this.state.lat,
			lng: this.state.lng,
			searchQuery: "",
			searchResults: config.default_search_results
		}
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleResultClick = this.handleResultClick.bind(this);
	}

	handleKeyDown(e) {
		this.setState({
			searchQuery: e.target.value,
			searchResults: config.default_search_results
		});
	}

	handleResultClick(e) {
		this.setState({
			lat: e.target.attributes['data-lat'].value,
			lng: e.target.attributes['data-lng'].value
		})
	}

	handleSearch(form) {
		clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {
			const url = `https://maps.googleapis.com/maps/api/geocode/json`;
			const data = {
				key: config.google_maps_key,
				address: form.target.value,
				components: "country:GB|country:US",
				location_type: "APPROXIMATE"
			}

			if(form.target.value) {
				$.ajax({
					url: url,
					data: data,
					success: (data) => {
						if(data.results.length) {
							this.setState({
								searchQuery: data.results[0].formatted_address,
								searchResults: data.results
							})
						}
					},
					error: (res, err) => {
						console.log(err);
					}
				});
			}
		}, 1000);
	}

	render() {
		let results = this.state.searchResults.map((val, index) => {
			return <Result key={index} handleResultClick={this.handleResultClick} data={val} />;
		});
		return (
			<div class={style.container}>
				<div class={style.navigation}>
					<Link className={style.back} href="/">
						<i class="fas fa-arrow-left"></i>
					</Link>
					<form name="place-search">
						<input type="text" class="form-control" name="place" value={this.state.searchQuery} onKeyDown={this.handleKeyDown} onKeyUp={this.handleSearch} placeholder="Search for location..." />
					</form>
				</div>
				<div class={style.results}>
					{results}
				</div>
			</div>
		);
	};
}

const Result = (props) => {
	return (
		<div class={style.result} onClick={props.handleResultClick} data-lng={props.data.geometry.location.lng} data-lat={props.data.geometry.location.lat}>
			{props.data.formatted_address}
		</div>
	);
}