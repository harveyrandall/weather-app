## Set-Up Guide
- [Installation](#installation)
- [Heroku](#heroku)

**0. Before doing any of this, if you're using your own laptop/desktop, make sure you've got the latest versions of node and npm installed (npm v: 4.0.5 & node v: 7.4.0) :**

```sh
node -v
npm -v
```

## Installation

**1. Clone this repository :**

```sh
git clone https://github.research.its.qmul.ac.uk/ec16183/WeatherApp weather-app
cd weather-app
```

**2. Install the dependencies :**

```sh
npm install
```

**3. Start local production server with [serve](https://github.com/zeit/serve):**

```sh
npm start
```

> This simply serves up the contents of `./build`. Bear in mind, if you use this, the localhost port your server is running on will refresh, and you'll also need to restart it to see any changes you've made to the code in `src`.


## Heroku

Final build version of the app can be found at [https://evening-beyond-50834.herokuapp.com/](https://evening-beyond-50834.herokuapp.com/)

To push to heroku you must keep devDependencies installed by running:

```sh
heroku config:set NPM_CONFIG_PRODUCTION=false
```

In your package.json file you must include the following as well:

```json 
{
...
"scripts": {
	...
	"heroku-prebuild": "npm install --dev"
	...
}
...
}
```

> More details can be found at [https://devcenter.heroku.com/articles/nodejs-support](https://devcenter.heroku.com/articles/nodejs-support)
