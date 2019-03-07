// import preact
import { h , Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';

// import the Button component

export default class Settings extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
	}

	// the main render method for the iphone component
	render() {
		return (
			<div class={style.container}>

				<div class={style.header}>
					<button class= {style.icon} data-panel-name="home" onClick={this.props.changePanel}>
						<i class="fa fa-arrow-left" data-panel-name="home" onClick={this.props.changePanel}/>
					</button>
					<h1>Settings</h1>
				</div>

				<div class = {style.list}>
					<div class = {style.option}>
						<h3>Units</h3>
						<select onChange={this.props.changeUnits} value={this.props.units}>
							<option value="si">Metric</option>
							<option value="us">Imperial</option>
						</select>
					</div>
					<div class = {style.divider}/>

				</div>

			</div>
		);
	}

}