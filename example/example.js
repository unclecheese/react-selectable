import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import data from './sample-data';

ReactDOM.render(<App items={data} />, document.getElementById('app'));