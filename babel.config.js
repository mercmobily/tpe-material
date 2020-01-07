module.exports = function (api) {
  api.cache(true)

  const presets = [
    [

      '@babel/env', {
        // modules: false,
        targets: {
          browsers: ['ie < 8']
        }
      }
    ]
  ]
  const plugins = []

  return {
    presets,
    plugins
  }
}
