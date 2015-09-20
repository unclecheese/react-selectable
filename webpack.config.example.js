module.exports = {
  entry: './src/example.js',
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
      modulesDirectories: ["node_modules"]
  }

};
