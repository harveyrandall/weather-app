// import preact
import { h, Component } from "preact";

// import stylesheets for ipad & button
import style from "./style";
const icons = {
	"Beanie": "../../assets/outfits/Beanie.png",
	"Cap": "../../assets/outfits/Cap.png",
	"Gloves": "../../assets/outfits/Gloves.png",
	"No-golf": "../../assets/outfits/No-golf.png",
	"Polo-shirt": "../../assets/outfits/Polo-shirt.png",
	"Rain-jacket": "../../assets/outfits/Rain-jacket.png",
	"Shoes": "../../assets/outfits/Shoes.png",
	"Shorts-Skirt": "../../assets/outfits/Shorts-Skirt.png",
	"Shorts": "../../assets/outfits/Shorts.png",
	"Skirt": "../../assets/outfits/Skirt.png",
	"Sweater": "../../assets/outfits/Sweater.png",
	"Trousers": "../../assets/outfits/Trousers.png",
	"Umbrella": "../../assets/outfits/Umbrella.png",
	"Windbreaker": "../../assets/outfits/Windbreaker.png"
};

export default class Outfits extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let x = this.props.conditions; // gets the weather "icon" from home page
		let clothes = []; // array for clothes
		// hat, top, bottom. gloves, shoes, accessories

		switch (x) {
			case "clear":
				clothes[0] = "Cap";
				clothes[1] = "Polo-shirt";
				clothes[2] = "Shorts-Skirt";
				clothes[3] = "Gloves";
				clothes[4] = "Shoes";
				break;
			case "clear-night":
				clothes[0] = "Cap";
				clothes[1] = "Sweater";
				clothes[2] = "Trousers";
				clothes[3] = "Gloves";
				clothes[4] = "Shoes";
				break;
			case "partly-cloudy-day":
				clothes[0] = "Cap";
				clothes[1] = "Windbreaker";
				clothes[2] = "Trousers";
				clothes[3] = "Gloves";
				clothes[4] = "Shoes";
				break;
			case "partly-cloudy-night":
				clothes[0] = "Beanie";
				clothes[1] = "Windbreaker";
				clothes[2] = "Trousers";
				clothes[3] = "Gloves";
				clothes[4] = "Shoes";
				break;
			case "cloudy":
				clothes[0] = "Cap";
				clothes[1] = "Windbreaker";
				clothes[2] = "Trousers";
				clothes[3] = "Gloves";
				clothes[4] = "Shoes";
				clothes[5] = "Umbrella";
				break;
			case "rain":
				clothes[0] = "Cap";
				clothes[1] = "Rain-jacket";
				clothes[2] = "Trousers";
				clothes[3] = "Gloves";
				clothes[4] = "Shoes";
				clothes[5] = "Umbrella";
				break;
			case "sleet":
				clothes[0] = "No-golf";
				break;
			case "snow":
				clothes[0] = "Beanie";
				clothes[1] = "Sweater";
				clothes[2] = "Trousers";
				clothes[3] = "Gloves";
				clothes[4] = "Shoes";
				break;
			case "wind":
				clothes[0] = "Beanie";
				clothes[1] = "Windbreaker";
				clothes[2] = "Trousers";
				clothes[3] = "Gloves";
				clothes[4] = "Shoes";
				break;
			case "fog":
				clothes[0] = "No-golf";
				break;
		}

		return (
			<div class={style.container}>
				<div class={style.header}>
					<h1>Outfit Suggestions</h1>
					<button class= {style.icon} data-panel-name="home" onClick={this.props.changePanel}>
						<i class="fa fa-times" data-panel-name="home" onClick={this.props.changePanel}/>
					</button>
				</div>
				<div class={style.outfits}>
					{clothes.map((val) => {
						let url = icons[val];
						const caption = (val === "No-golf") ? "It is not recommended you play golf in these conditions." : "";
						if (val !== "") {
							return (
								<img class={style.item} src={url} caption={caption} />
							);
						}
					})}
				</div>
			</div>
		);
	}
}
