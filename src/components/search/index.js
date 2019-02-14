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
				<Navigation query={this.state.searchQuery}/>
				<Results />
			</div>
		);
	};
}

const Navigation = (props) => {
	return (
		<div class={style.navigation}>
			<form>
				<input type="text" class="form-control" value={props.query} placeholder="Search..." />
			</form>
			<Link className={style.back} href={"/"}>
				<i class="fas fa-arrow-right"></i>
			</Link>
		</div>
	);
}

const Results = (props) => {
	return <div></div>;
}