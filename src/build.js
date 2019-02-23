/* @flow */

import webpack from 'webpack';
import fs from 'fs-extra';
import path from 'path';
import buildEntry from './utils/buildEntry';
import buildHTML from './utils/buildHTML';
import configureWebpack from './utils/configureWebpack';
import collectData from './utils/collectData';
import stringifyData from './utils/stringifyData';
import buildPageInfo from './utils/buildPageInfo';
import type { Options } from './types';

export default function build({
  root = process.cwd(),
  assets,
  scripts,
  styles,
  pages: getPages,
  github,
  logo,
  output,
}: Options) {
  const pages = typeof getPages === 'function' ? getPages() : getPages;
  const data = pages.map(page =>
    page.type === 'separator' ? page : collectData(page, { root })
  );

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  if (assets) {
    assets.forEach(dir => {
      fs.copySync(dir, path.join(output, path.basename(dir)));
    });
  }

  if (scripts) {
    scripts.forEach(name => {
      fs.copySync(name, path.join(output, 'scripts', path.basename(name)));
    });
  }

  fs.writeFileSync(
    path.join(output, 'app.src.js'),
    buildEntry({ styles, github, logo })
  );

  fs.writeFileSync(path.join(output, 'app.data.js'), stringifyData(data));

  buildPageInfo(data).forEach(info => {
    fs.writeFileSync(
      path.join(output, `${info.link}.html`),
      buildHTML({
        data,
        info,
        github,
        logo,
        sheets: ['app.css'],
        scripts: scripts ? scripts.map(s => `scripts/${path.basename(s)}`) : [],
      })
    );
  });

  const config = configureWebpack({
    root,
    entry: path.join(output, 'app.src.js'),
    output: {
      path: output,
      bundle: 'app.bundle.js',
      style: 'app.css',
    },
    production: true,
  });
  webpack(config).run((err, stats) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        stats.toString({
          chunks: false,
          colors: true,
        })
      );
    }
  });
}
