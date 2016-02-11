var webpack  = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist', // This is where images AND js will go
    publicPath: '', // This is used to generate URLs to e.g. images
    filename: 'react-selectable.js',
    libraryTarget: 'umd'
  },
  externals: {
    'react': {
		root: 'React',
		commonjs2: 'react',
		commonjs: 'react',
		amd: 'react',    	
    },
    'react-dom': {
		root: 'ReactDOM',
		commonjs2: 'react-dom',
		commonjs: 'react-dom',
		amd: 'react-dom'
  	}
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
      modulesDirectories: ["node_modules"],
  }
};
