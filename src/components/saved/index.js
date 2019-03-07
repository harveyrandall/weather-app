// import preact
import { h, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';

export default class Saved extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div class={style.container}>
				<aside class={style.saved_pane}>
					<header class={style.saved_header}>
						Saved Locations
						<span data-panel-name="home" onClick={this.props.changePanel}>
							<i class="fas fa-times" data-panel-name="home" onClick={this.props.changePanel} />
						</span>
					</header>
					<div class={style.panel_buttons}>
						<div class={style.saved_locations}>
							{this.props.savedLocations.map((val) => {
								return (
									<div class={style.option}
										data-formatted-address={val.formatted_address}
										data-lat={val.geometry.location.lat}
										data-lng={val.geometry.location.lng}
										onClick={this.props.updateLocation}
									>
										{val.formatted_address}
									</div>
								);
							})}
							<div class={style.option} onClick={this.props.addSavedLocation}>
								<i class="fas fa-plus" onClick={this.props.addSavedLocation}/>
							</div>
						</div>
						<div class={style.bottom_buttons}>
							<div class={style.bottom_option} data-panel-name="settings" onClick={this.props.changePanel}>
								<i class="fas fa-cog" data-panel-name="settings" onClick={this.props.changePanel} />
							</div>
							<div class={style.bottom_option} data-panel-name="outfits" onClick={this.props.changePanel}>
								<i class="fas fa-tshirt" data-panel-name="outfits" onClick={this.props.changePanel}/>
							</div>
						</div>
					</div>
				</aside>
			</div>
		);
	}
}