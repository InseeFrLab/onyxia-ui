module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    const fileLoaderRule = config.module.rules.find(rule => rule.test && rule.test.test('.svg'))
    if( fileLoaderRule ){
      fileLoaderRule.exclude = /\.svg$/
    }
    config.module.rules.push({
      test: /\.svg$/,
      loader: require.resolve('@svgr/webpack')
    })
    return config;
  },
}
