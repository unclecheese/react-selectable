module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist', // This is where images AND js will go
    publicPath: '', // This is used to generate URLs to e.g. images
    filename: 'react-selectable.js',
    library: 'Selectable',
    libraryTarget: 'var'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
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
