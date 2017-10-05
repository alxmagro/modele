// See http://brunch.io for documentation.
exports.files = {
  javascripts: {
    joinTo: {
      'modele.js': /^src|^node_modules/
    }
  }
}

exports.paths = {
  public: 'dist',
  watched: ['src']
}

exports.plugins = {
  babel: { presets: ['latest'] }
}
