var util = require('util');

function inherit () {
    
    if( arguments.length < 2 ) return;

    var target = arguments[ 0 ];
    
    var parent;
    
    for ( i = 1; i < arguments.length; i++ ) {
    
        parent = arguments[ i ];
    
        // If parent is a functional object, copy
        // from parent.prototype into the target.prototype:
        if( typeof parent === 'function' ) {
            
            for ( var name in parent.prototype ) {

                if ( typeof parent.prototype[ name ] === 'object' ) {

                    target.prototype[ name ] = 
                        util._extend( {}, parent.prototype[ name ] );
                }
                else {

                    target.prototype[ name ] = parent.prototype[ name ];
                }

            }

            // copy props from parent into the target
            // ( ie static vars and methods )
            for ( var name in parent ) {
                target[ name ] = parent[ name ];
            }
            
        } 

        //if it is an object, apply to the prototype
        else if( typeof parent === 'object' ) {
            for ( var name in parent ) {
                target.prototype[ name ] = util._extend( {}, parent[ name ] );
            }
        }
        
    }

};

function Klass () {};

Klass.prototype.super = {};

Klass.extend = function () {

    if ( arguments.length < 1 ) throw 'incorrect arguments';
    
    var name = null;
    var func = null;

    if ( arguments.length == 1 ) {
        func = Array.prototype.shift.apply( arguments );
        name = func.prototype.constructor.name;
        if ( name.length < 1 ) throw 'bad class constructor name';
    } else {
        name = arguments[0];
        func = new Function(
            "fnc", "return function " + name + "(){ fnc() };"
        )( arguments[1] );
    }

    inherit( func, this );
    func.prototype.super[ this.prototype.constructor.name ] = this.prototype;

    return func;
}

// Klass.extend2 = function () {

//     if ( arguments.length < 1 ) throw 'must provide class function.';

//     var childClass = Array.prototype.shift.apply( arguments );

//     if ( typeof childClass !== 'function' ) throw 'argument must be a function.';

//     var chName = childClass.prototype.constructor.name;
//     if ( chName === undefined || chName.length < 1 ) throw 'bad class constructor name';

//     inherit( childClass, this );
//     childClass.prototype.super[ this.prototype.constructor.name ] = this.prototype;

//     return childClass;
// }

// Klass.ext = function ( name, constructor ) {

//     var Child = new Function(
//         "action", "return function " + name + "(){ action() };"
//     )(constructor);

//     inherit( Child, this );
//     Child.prototype.super[ this.prototype.constructor.name ] = this.prototype;

//     return Child;
// }

Klass.prototype.getType = function () {
    return this.constructor.name;
}

module.exports.Klass = Klass;