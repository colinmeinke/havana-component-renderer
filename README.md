# Havana component renderer

[![NPM version](https://badge.fury.io/js/havana-component-renderer.svg)](http://badge.fury.io/js/havana-component-renderer)
[![Build Status](https://travis-ci.org/colinmeinke/havana-component-renderer.svg?branch=master)](https://travis-ci.org/colinmeinke/havana-component-renderer)
[![Dependency status](https://david-dm.org/colinmeinke/havana-component-renderer.svg)](https://david-dm.org/colinmeinke/havana-component-renderer.svg)

A component renderer.

Havana component renderer works with an HTML response
handler such as
[Havana component compiler](https://github.com/colinmeinke/havana-component-compiler)
or a library with an interchangeable API. When a component
compiler publishes a `component.render` event Havana component
renderer will use the Fetch API to retrieve the component
template (the endpoint is worked out from the root URL,
component directory and template pattern passed in on
instantiation plus the component name). Havana component
renderer will then compile the template using the compiler
function passed in on instantiation (i.e. mustache.compile).
The compiler function is expected to return a function, which
is then invoked with the component's properties object. An
HTML string is returned and published by Havana component
renderer in a `component.rendered` event.

## How to install

```
npm install havana-component-renderer
```

## How to use

```javascript
import ComponentCompiler from 'havana-component-compiler';
import ComponentHandler from 'havana-component-handler';
import ComponentRenderer from 'havana-component-renderer';
import Event from 'havana-event';
import Router from 'havana-router';
import Server from 'havana-server';
import Static from 'havana-static';

import handlebars from 'handlebars';

const event = new Event();

const port = 3000;

const reporting = {
  'level': 2, 
  'reporter': console.log,
};

const server = new Server({
  'event': event,
  'reporting': reporting,
});

new Static({
  'event': event,
  'reporting': reporting,
  'rootDir': __dirname,
  'staticDir': 'public',
});

new Router({
  'event': event,
  'reporting': reporting,
  'routes': [
    {
      'url': '/',
      'method': 'GET',
      'components': [
        {
          'component': 'page',
          'properties': {
            'content': 'Hello world',
          },
        },
      ],
    },
  ],
});

new ComponentCompiler({
  'event': event,
  'reporting': reporting,
});

new ComponentRenderer({
  'compiler': handlebars.compile,
  'componentDir': 'component',
  'event': event,
  'reporting': reporting,
  'rootURL': `http://localhost:${port}`,
  'templatePattern': ':name/template/:name.hbs',
});

new ComponentHandler({
  'event': event,
  'reporting': reporting,
});

server.listen( port );
```

The above will expect the following directory structure:

```
— server.js
— public
  — component
    — page
      — template
        — page.hbs
```

## Event list

Events take the form of
[Havana event](https://github.com/colinmeinke/havana-event)
or a library with an interchangeable API.

### Publish

- `component.rendered`: Signifies that a component has
  been rendered into an HTML string for consumption by a
  component compiler.

### Subscribe

- `component.render`: Allows a component compiler to notify
  Havana component renderer that it requires a component
  object rendered to an HTML string.

## ES2015+

Havana component renderer is written using ES2015+ syntax.

However, by default this module will use an ES5
compatible file that has been compiled using
[Babel](https://babeljs.io).

In the `dist` directory there are four files, the default
is `renderer.server.js`. The default when using a client-side
bundler that supports the
[browser field](https://gist.github.com/defunctzombie/4339901)
spec is `renderer.browser.js`.

Havana component renderer currently requires the 
[Babel polyfill](https://babeljs.io/docs/usage/polyfill).
You are expected to supply this yourself. However, as a
courtesy you will also find `renderer.server.with-polyfill.js`
and `renderer.browser.with-polyfill.js` in the `dist`
directory.
