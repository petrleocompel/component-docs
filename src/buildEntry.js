/* @flow */

export default function buildEntry({ layout }: { layout: string }) {
  return `
import React from 'react';
import ReactDOM from 'react-dom';
import RedBox from 'redbox-react';
import App from '${require.resolve('./templates/App')}';
import Layout from '${layout}';
import data from './app.data.json';
import '${require.resolve('./styles/reset.css')}';
import '${require.resolve('./styles/globals.css')}';

const root = document.getElementById('root');
const render = () => {
  try {
    ReactDOM.hydrate(
      <App
        name={window.__INITIAL_PATH__}
        data={data}
        layout={Layout}
      />,
      root
    );
  } catch (e) {
    ReactDOM.render(
      <RedBox error={e} />,
      root
    );
  }
};

if (module.hot) {
  module.hot.accept(() => {
    render();
  });
}

render();
`;
}
