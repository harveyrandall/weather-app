// import preact
import { h, render, Component } from 'preact';
import { Link } from 'preact-router';

const $ = window.$;

// import stylesheets for ipad & button
import style from './style';
// import jquery for API calls
//import $ from 'jquery';
// import the Button component
import Button from '../button';
import style_iphone from '../button/style_iphone';
import * as config from '../../config.json';

export default class Search extends Component {

	// a constructor with initial set states
	constructor(){
		super();
	}

	componentDidMount() {
		this.setState({
			searchQuery: this.props.location
		});
	}

	render() {
		return (
			<div class={style.container}>
				<Navigation query={this.props.location}/>
				<Results />
			</div>
		);
	};
}

class Navigation extends Component {
	constructor(props) {
		super(props);

    	this.autocomplete = null;
    	this.handlePlaceChanged = this.handlePlaceChanged.bind(this);

	}

	componentDidMount() {
		//this.findLocation(this.props.query);
		this.autocompleteInput = document['place-search'].place;
		this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput,
        {"types": ["geocode"], "radius": 500});

    	this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
	}

	handlePlaceChanged() {
		const place = this.autocomplete.getPlace();
		alert(place);
	}

	findLocation(city) {
		$.ajax({
			url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${city}&types=geocode&radius=500&key=${config.google_maps_key}`,
			dataType: "jsonp",
			success: (data) => {
				console.log(data);
			}
		});
	}

	endOfTyping(event) {
		this.timer=setTimeout(this.findLocation, 3000)
	}

	render() {
		return (
			<div class={style.navigation}>
				<form name="place-search">
					<input type="text" class="form-control" name="place" value={this.props.query} placeholder="Search..." />
				</form>
				<Link className={style.back} href={"/"}>
					<i class="fas fa-arrow-right"></i>
				</Link>
			</div>
		);
	}
}

const Results = (props) => {
	return <div></div>;
}