const path = require('path');
module.exports = {
  entry: './example/example.js',
  output: {
    path: path.resolve(__dirname,'example'), // This is where images AND js will go
    publicPath: '', // This is used to generate URLs to e.g. images
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
      modules: [path.resolve(__dirname),"node_modules","dist"]
  }

};
