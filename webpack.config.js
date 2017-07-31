module.exports = {
  entry: './src/app.js',
  output: {
//    filename: 'bundle.js',
    //path:+__dirname+'/',
//    path: './dist'
    filename: './dist/app.b.js'
  },
	module: {
	  rules: [
	    {
	      test: /\.js$/,
	      exclude: [/node_modules/],
	      use: [{
	        loader: 'babel-loader',
	        options: { 
	        	presets: ['es2015'] 
	        }
	      }]
	    }
	  ]
	}
}