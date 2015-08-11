/* global describe it after */

import chai from 'chai';
import ComponentRenderer from '../../dist/renderer.server.with-polyfill';
import Event from 'havana-event';
import handlebars from 'handlebars';
import path from 'path';
import Server from 'havana-server';
import Static from 'havana-static';

const expect = chai.expect;

const event = new Event();

const port = 3000;

const reporting = {
  'level': 0,
  'reporter': console.log,
};

const server = new Server({
  'event': event,
  'reporting': reporting,
});

new Static({
  'event': event,
  'reporting': reporting,
  'rootDir': path.join( __dirname, '..', 'lib' ),
  'staticDir': 'public',
});

let renderer = new ComponentRenderer({
  'compiler': handlebars.compile,
  'componentDir': 'component',
  'event': event,
  'reporting': reporting,
  'rootURL': `http://localhost:${port}`,
  'templatePattern': ':name/template/:name.hbs',
});

server.listen( port );

describe( 'Renderer', () => {
  describe( '_', () => {
    it( 'should be private', () => {
      expect( renderer ).to.not.have.property( '_' );
    });
  });

  describe( 'compiler', () => {
    it( 'should be private', () => {
      expect( renderer ).to.not.have.property( 'compiler' );
    });
  });

  describe( 'componentDir', () => {
    it( 'should be private', () => {
      expect( renderer ).to.not.have.property( 'componentDir' );
    });
  });

  describe( 'event', () => {
    it( 'should be private', () => {
      expect( renderer ).to.not.have.property( 'event' );
    });
  });

  describe( 'reporting', () => {
    it( 'should be private', () => {
      expect( renderer ).to.not.have.property( 'reporting' );
    });
  });

  describe( 'rootURL', () => {
    it( 'should be private', () => {
      expect( renderer ).to.not.have.property( 'rootURL' );
    });
  });

  describe( 'templatePattern', () => {
    it( 'should be private', () => {
      expect( renderer ).to.not.have.property( 'templatePattern' );
    });
  });

  describe( 'component.rendered', () => {
    it( 'should be published when a component compiler publishes a component.render event', done => {
      const token = event.subscribe( 'component.rendered', () => {
        event.unsubscribe( token );
        done();
      });

      event.publish( 'component.render', {
        'componentId': 1,
        'data': {
          'components': [
            {
              'component': 'hello-world',
              'id': 1,
            },
          ],
        },
      });
    });

    it( 'should assign the rendered content to the content key of the component', done => {
      const token = event.subscribe( 'component.rendered', data => {
        event.unsubscribe( token );
        expect( data.data.components[ 0 ].content ).to.equal( 'Hello world\n' );
        done();
      });

      event.publish( 'component.render', {
        'componentId': 1,
        'data': {
          'components': [
            {
              'component': 'hello-world',
              'id': 1,
            },
          ],
        },
      });
    });

    it( 'should assign the rendered content to the correct object key of the parent component', done => {
      const token = event.subscribe( 'component.rendered', data => {
        event.unsubscribe( token );
        expect( data.data.components[ 0 ].properties.content ).to.equal( 'Hello world\n' );
        done();
      });

      event.publish( 'component.render', {
        'componentId': 2,
        'data': {
          'components': [
            {
              'component': 'parent',
              'children': [ 2 ],
              'id': 1,
              'properties': {
                'content': null,
              },
            },
            {
              'component': 'hello-world',
              'id': 2,
              'parent': 1,
              'propertyKey': 'content',
            },
          ],
        },
      });
    });

    it( 'should assign the rendered content to the correct array key of the parent component', done => {
      const token = event.subscribe( 'component.rendered', data => {
        event.unsubscribe( token );
        expect( data.data.components[ 0 ].properties.content[ 2 ]).to.equal( 'Hello world\n' );
        done();
      });

      event.publish( 'component.render', {
        'componentId': 2,
        'data': {
          'components': [
            {
              'component': 'parent',
              'children': [ 2 ],
              'id': 1,
              'properties': {
                'content': [],
              },
            },
            {
              'component': 'hello-world',
              'id': 2,
              'parent': 1,
              'propertyKey': 'content',
              'arrayKey': 2,
            },
          ],
        },
      });
    });
  });

  describe( 'getTemplatePath()', () => {
    it( 'should return the correct template path', () => {
      const temp = renderer.getTemplatePath( 'hello-world' );
      expect( temp ).to.equal( `http://localhost:${port}/component/hello-world/template/hello-world.hbs` );
    });
  });
});

after(() => {
  server.close();
});
