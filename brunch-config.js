// See http://brunch.io for documentation.
exports.files = {
  javascripts: {
    joinTo: {
      'modele.js': /^src/
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
