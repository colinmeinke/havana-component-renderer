require('../node_modules/gulp-babel/node_modules/babel-core/polyfill.js');

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('isomorphic-fetch');

var _ = new WeakMap();

var Renderer = (function () {
  function Renderer(config) {
    _classCallCheck(this, Renderer);

    var props = {
      'compiler': config.compiler,
      'componentDir': config.componentDir,
      'event': config.event,
      'reporting': config.reporting,
      'rootURL': config.rootURL,
      'templatePattern': config.templatePattern
    };

    _.set(this, props);

    this.init();
  }

  _createClass(Renderer, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var _$get = _.get(this);

      var compiler = _$get.compiler;
      var event = _$get.event;
      var reporting = _$get.reporting;

      event.subscribe('component.render', function callee$2$0(data) {
        var component, parent, i, l, response, content, template, html;
        return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              component = undefined;
              parent = undefined;
              i = 0, l = data.data.components.length;

            case 3:
              if (!(i < l)) {
                context$3$0.next = 10;
                break;
              }

              if (!(data.data.components[i].id === data.componentId)) {
                context$3$0.next = 7;
                break;
              }

              component = data.data.components[i];
              return context$3$0.abrupt('break', 10);

            case 7:
              i++;
              context$3$0.next = 3;
              break;

            case 10:
              if (!(component.parent !== undefined)) {
                context$3$0.next = 19;
                break;
              }

              i = 0, l = data.data.components.length;

            case 12:
              if (!(i < l)) {
                context$3$0.next = 19;
                break;
              }

              if (!(data.data.components[i].id === component.parent)) {
                context$3$0.next = 16;
                break;
              }

              parent = data.data.components[i];
              return context$3$0.abrupt('break', 19);

            case 16:
              i++;
              context$3$0.next = 12;
              break;

            case 19:
              context$3$0.prev = 19;
              context$3$0.next = 22;
              return regeneratorRuntime.awrap(fetch(this.getTemplatePath(component.component)));

            case 22:
              response = context$3$0.sent;
              context$3$0.next = 25;
              return regeneratorRuntime.awrap(response.text());

            case 25:
              content = context$3$0.sent;
              template = compiler(content);
              html = template(component.properties || {});

              if (parent) {
                if (component.arrayKey !== undefined) {
                  parent.properties[component.propertyKey][component.arrayKey] = html;
                } else {
                  parent.properties[component.propertyKey] = html;
                }
              } else {
                component.content = html;
              }

              if (reporting.level > 1) {
                reporting.reporter('-- Component rendered');
              }

              component.state = 'rendered';

              event.publish('component.rendered', data);
              context$3$0.next = 37;
              break;

            case 34:
              context$3$0.prev = 34;
              context$3$0.t0 = context$3$0['catch'](19);

              console.log(context$3$0.t0);

            case 37:
            case 'end':
              return context$3$0.stop();
          }
        }, null, _this, [[19, 34]]);
      });
    }
  }, {
    key: 'getTemplatePath',
    value: function getTemplatePath(name) {
      var _$get2 = _.get(this);

      var componentDir = _$get2.componentDir;
      var rootURL = _$get2.rootURL;
      var templatePattern = _$get2.templatePattern;

      var template = templatePattern.replace(/:name/g, name);

      return rootURL + '/' + componentDir + '/' + template;
    }
  }]);

  return Renderer;
})();

exports['default'] = Renderer;
module.exports = exports['default'];