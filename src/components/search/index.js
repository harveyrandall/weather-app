// import preact
import { h, Component } from 'preact';
import { Link } from 'preact-router';

// import stylesheets for ipad & button
import style from './style';
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
		};
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
		});
	}

	handleSearch(form) {
		clearTimeout(this.timeout);

		const searchterm = form.target.value.toLowerCase();
		const searchResults = this.state.searchResults;
		this.timeout = setTimeout(() => {
			let results = searchResults.filter(val => val.formatted_address.toLowerCase().indexOf(searchterm) !== -1);
			this.setState({
				searchQuery: searchterm,
				searchResults: results
			});
		}, 500);
	}

	render() {
		let results = this.state.searchResults.map((val, index) => {
			return <Result key={index} handleResultClick={this.props.updateLocation} data={val} />;
		});

		return (
			<div class={style.container}>
				<div class={style.navigation}>
					<div className={style.back} onClick={this.props.changePanel} data-panel-name="home">
						<i class="fas fa-arrow-left" data-panel-name="home" />
					</div>
					<form name="place-search">
						<input type="text" class="form-control" name="place" value={this.state.searchQuery} onKeyDown={this.handleKeyDown} onKeyUp={this.handleSearch} placeholder="Search for location..." />
					</form>
				</div>
				<div class={style.results}>
					{results}
				</div>
			</div>
		);
	}
}

const Result = (props) => {
	return (
		<div class={style.result} onClick={props.handleResultClick}
		data-formatted-address={props.data.formatted_address} data-lng={props.data.geometry.location.lng} data-lat={props.data.geometry.location.lat}>
			{props.data.formatted_address}
		</div>
	);
};
