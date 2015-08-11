import 'isomorphic-fetch';

const _ = new WeakMap();

class Renderer {
  constructor ( config ) {
    const props = {
      'compiler': config.compiler,
      'componentDir': config.componentDir,
      'event': config.event,
      'reporting': config.reporting,
      'rootURL': config.rootURL,
      'templatePattern': config.templatePattern,
    };

    _.set( this, props );

    this.init();
  }

  init () {
    const { compiler, event, reporting } = _.get( this );

    event.subscribe( 'component.render', async data => {
      let component;
      let parent;

      for ( let i = 0, l = data.data.components.length; i < l; i++ ) {
        if ( data.data.components[ i ].id === data.componentId ) {
          component = data.data.components[ i ];
          break;
        }
      }

      if ( component.parent !== undefined ) {
        for ( let i = 0, l = data.data.components.length; i < l; i++ ) {
          if ( data.data.components[ i ].id === component.parent ) {
            parent = data.data.components[ i ];
            break;
          }
        }
      }

      try {
        const response = await fetch( this.getTemplatePath( component.component ));
        const content = await response.text();

        const template = compiler( content );

        let html = template( component.properties || {});

        if ( parent ) {
          if ( component.arrayKey !== undefined ) {
            parent.properties[ component.propertyKey ][ component.arrayKey ] = html;
          } else {
            parent.properties[ component.propertyKey ] = html;
          }
        } else {
          component.content = html;
        }

        if ( reporting.level > 1 ) {
          reporting.reporter( '-- Component rendered' );
        }

        component.state = 'rendered';

        event.publish( 'component.rendered', data );
      } catch ( error ) {
        console.log( error );
      }
    });
  }

  getTemplatePath ( name ) {
    const { componentDir, rootURL, templatePattern } = _.get( this );

    const template = templatePattern.replace( /:name/g, name );

    return `${rootURL}/${componentDir}/${template}`;
  }
}

export default Renderer;
