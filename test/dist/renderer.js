/* global describe it after */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _distRendererServerWithPolyfill = require('../../dist/renderer.server.with-polyfill');

var _distRendererServerWithPolyfill2 = _interopRequireDefault(_distRendererServerWithPolyfill);

var _havanaEvent = require('havana-event');

var _havanaEvent2 = _interopRequireDefault(_havanaEvent);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _havanaServer = require('havana-server');

var _havanaServer2 = _interopRequireDefault(_havanaServer);

var _havanaStatic = require('havana-static');

var _havanaStatic2 = _interopRequireDefault(_havanaStatic);

var expect = _chai2['default'].expect;

var event = new _havanaEvent2['default']();

var port = 3000;

var reporting = {
  'level': 0,
  'reporter': console.log
};

var server = new _havanaServer2['default']({
  'event': event,
  'reporting': reporting
});

new _havanaStatic2['default']({
  'event': event,
  'reporting': reporting,
  'rootDir': _path2['default'].join(__dirname, '..', 'lib'),
  'staticDir': 'public'
});

var renderer = new _distRendererServerWithPolyfill2['default']({
  'compiler': _handlebars2['default'].compile,
  'componentDir': 'component',
  'event': event,
  'reporting': reporting,
  'rootURL': 'http://localhost:' + port,
  'templatePattern': ':name/template/:name.hbs'
});

server.listen(port);

describe('Renderer', function () {
  describe('_', function () {
    it('should be private', function () {
      expect(renderer).to.not.have.property('_');
    });
  });

  describe('compiler', function () {
    it('should be private', function () {
      expect(renderer).to.not.have.property('compiler');
    });
  });

  describe('componentDir', function () {
    it('should be private', function () {
      expect(renderer).to.not.have.property('componentDir');
    });
  });

  describe('event', function () {
    it('should be private', function () {
      expect(renderer).to.not.have.property('event');
    });
  });

  describe('reporting', function () {
    it('should be private', function () {
      expect(renderer).to.not.have.property('reporting');
    });
  });

  describe('rootURL', function () {
    it('should be private', function () {
      expect(renderer).to.not.have.property('rootURL');
    });
  });

  describe('templatePattern', function () {
    it('should be private', function () {
      expect(renderer).to.not.have.property('templatePattern');
    });
  });

  describe('component.rendered', function () {
    it('should be published when a component compiler publishes a component.render event', function (done) {
      var token = event.subscribe('component.rendered', function () {
        event.unsubscribe(token);
        done();
      });

      event.publish('component.render', {
        'componentId': 1,
        'data': {
          'components': [{
            'component': 'hello-world',
            'id': 1
          }]
        }
      });
    });

    it('should assign the rendered content to the content key of the component', function (done) {
      var token = event.subscribe('component.rendered', function (data) {
        event.unsubscribe(token);
        expect(data.data.components[0].content).to.equal('Hello world\n');
        done();
      });

      event.publish('component.render', {
        'componentId': 1,
        'data': {
          'components': [{
            'component': 'hello-world',
            'id': 1
          }]
        }
      });
    });

    it('should assign the rendered content to the correct object key of the parent component', function (done) {
      var token = event.subscribe('component.rendered', function (data) {
        event.unsubscribe(token);
        expect(data.data.components[0].properties.content).to.equal('Hello world\n');
        done();
      });

      event.publish('component.render', {
        'componentId': 2,
        'data': {
          'components': [{
            'component': 'parent',
            'children': [2],
            'id': 1,
            'properties': {
              'content': null
            }
          }, {
            'component': 'hello-world',
            'id': 2,
            'parent': 1,
            'propertyKey': 'content'
          }]
        }
      });
    });

    it('should assign the rendered content to the correct array key of the parent component', function (done) {
      var token = event.subscribe('component.rendered', function (data) {
        event.unsubscribe(token);
        expect(data.data.components[0].properties.content[2]).to.equal('Hello world\n');
        done();
      });

      event.publish('component.render', {
        'componentId': 2,
        'data': {
          'components': [{
            'component': 'parent',
            'children': [2],
            'id': 1,
            'properties': {
              'content': []
            }
          }, {
            'component': 'hello-world',
            'id': 2,
            'parent': 1,
            'propertyKey': 'content',
            'arrayKey': 2
          }]
        }
      });
    });
  });

  describe('getTemplatePath()', function () {
    it('should return the correct template path', function () {
      var temp = renderer.getTemplatePath('hello-world');
      expect(temp).to.equal('http://localhost:' + port + '/component/hello-world/template/hello-world.hbs');
    });
  });
});

after(function () {
  server.close();
});