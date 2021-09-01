var paths = require('react-scripts/config/paths');
var path = require ('path');

module.exports = {
    webpack: function override(config) {
        var addr1 = path.resolve(__dirname,'../' + (process.platform === 'win32' ? '\\component-library\\src' : 'component-library/src'));
        var addr2 = path.resolve(__dirname,'../' + (process.platform === 'win32' ? '\\node_modules\\desktop-components-library\\src' : 'node_modules/desktop-components-library/src'));
        config.module.rules.push({
            test: /\.(js|jsx)$/,
            include: [
                paths.appSrc, 
                addr1,
                addr2
            ],
            loader: require.resolve('babel-loader'),
            options: {
                babelrc: false,
                presets: [require.resolve('babel-preset-react-app')],
                cacheDirectory: true,
            },
        });
        // console.log('Current watch op', config)
        return config
    },
    devServer: function overrideDevServer(configFunction) {
        return function(proxy, allowedHost) {
            // Create the default config by calling configFunction with the proxy/allowedHost parameters
            const config = configFunction(proxy, allowedHost);
            config.watchOptions = {
            };
       
            // Return your customised Webpack Development Server config.
            return config;
          };
    }
}
