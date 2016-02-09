const path = require('path');
module.exports = {
  entry: './example/example.js',
  output: {
    path: './example', // This is where images AND js will go
    publicPath: '', // This is used to generate URLs to e.g. images
    filename: 'bundle.js'
  },

  module: {
    loaders: [,
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
	  root: path.resolve(__dirname),
      modulesDirectories: ["node_modules","dist"]
  }

};
