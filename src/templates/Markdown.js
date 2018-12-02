/* @flow */

import * as React from 'react';
import { css, cx } from 'linaria';
import marked from 'marked';
import sanitize from 'sanitize-html';
import escape from 'escape-html';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';

const markdown = css`
  .anchor {
    margin-left: -20px;
    margin-right: -2px;
    opacity: 0;

    &:hover {
      opacity: 1;
    }
  }

  h1:hover > .anchor,
  h2:hover > .anchor,
  h3:hover > .anchor,
  h4:hover > .anchor,
  h5:hover > .anchor,
  h6:hover > .anchor {
    opacity: 1;
  }

  /* Syntax highlighting */
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #90a4ae;
  }

  .token.punctuation {
    color: #9e9e9e;
  }

  .namespace {
    opacity: 0.7;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #e91e63;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #4caf50;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #795548;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #3f51b5;
  }

  .token.function {
    color: #f44336;
  }

  .token.regex,
  .token.important,
  .token.variable {
    color: #ff9800;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }
`;

type Props = {
  source: string,
  className?: string,
};

const renderer = new marked.Renderer();

renderer.heading = function heading(...args) {
  return marked.Renderer.prototype.heading.apply(this, args).replace(
    /^(<h[1-3] .+>)(.+)(<\/h[1-3]>)/,
    (match, p1, p2, p3) =>
      `${p1}
          <a class="anchor" href="#${p2
            .toLowerCase()
            .replace(/[^a-z0-9]+/, '-')}">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>
            </svg>
          </a>
        ${p2}${p3}`
  );
};

export default class Markdown extends React.Component<Props> {
  render() {
    let html = marked(this.props.source, {
      renderer,
      gfm: true,
      silent: true,
      highlight: (code, lang) => {
        const grammar = lang === 'js' ? languages.jsx : languages[lang];
        return grammar ? highlight(code, grammar) : escape(code);
      },
    });

    // eslint-disable-next-line global-require
    html = sanitize(html, require('../configs/santize-config.json'));

    return (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: html,
        }}
        className={cx(this.props.className, markdown)}
      />
    );
  }
}
