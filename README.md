# DOM Connector library

Tiny library to draw connections between DOM element.
Still proof of concept, under development.

## NPM scripts

 - `npm t`: Run test suite
 - `npm start`: Runs `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run build`: Generage bundles and typings, create docs
 - `npm run lint`: Lints code

## Build and test

 - `npm run build`
 - `open example/index.html`

 Also visible [here](http://xilinus.com/dom-connector/index.html)

## Usage

 ```css
#e1, #e2 {
  width: 100px;
  height: 100px;
  margin: 20px;
  background-color: #DDD;
}
 ```

 ``` html
<div id="e1"></div>
<div id="e2"></div>
 ```

 ``` js
 const connector = DomConnector.connect(
   document.getElementById('e1'),
   document.getElementById('e2'),
   { from: 'bottom-middle', to: 'top-middle', className: 'line-join' }
 );
 ```

## Credits

  Sébastien Gruhier <sgruhier@gmail.com>

## Boilerplate

Based on https://github.com/alexjoverm/typescript-library-starter starter kit with some modifications
