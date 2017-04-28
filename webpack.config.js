/// <binding ProjectOpened='Watch - Development' /> 

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: './dist/bundle.js',
  },
  resolve: {
    extensions: [ '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },

  module: {
    loaders: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',

  }
};

