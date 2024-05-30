# REACT + SOLANA/ANCHOR DEMO
This repository was created for educational purposes to help front-end developers who are already familiar with React and EVM-compatible blockchain interactions learn and understand Solana blockchain interactions.

- This is NOT an example of a production-ready project.
- This is a demonstration of wallet integration and use of the Anchor/Solana libraries.

## USEFUL LINKS
- https://github.com/solana-labs/wallet-adapter/blob/master/FAQ.md
- https://github.com/solana-labs/wallet-adapter/blob/master/APP.md
- https://github.com/solana-developers/create-solana-dapp
- https://github.com/solana-labs/wallet-adapter/blob/master/packages/starter/react-ui-starter/src/App.tsx


## ERRORS HANDLING

### Polyfill error

In case of polyfill error (Module not found: Error: Can't resolve 'crypto' ...)
```
npm install node-polyfill-webpack-plugin react-app-rewired --save-dev
```
create `config-overrides.js` file in the root directory

```JavaScript
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = function override(config, env) {
  config.plugins.push(new NodePolyfillPlugin())
  return config
}
```

And change `package.json`
```JSON
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
```