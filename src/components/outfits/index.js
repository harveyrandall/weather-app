import {h, Component} from 'preact';
import style from './style';

export default class Outfits extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let x = this.props.conditions;
		let clothes = [];
		if (x === 'clear') {
			clothes.push("fas fa-glasses");
		}

		return (
			<div class={style.container}>
				<div class={style.outfits}>
					{clothes.map((val) => {
						if (val !== null) {
							return <i class={val} />;
						}
						return <i class="fas fa-sun" />;
					})}
				</div>
			</div>
		);
	}
}