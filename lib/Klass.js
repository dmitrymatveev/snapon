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

Klass.typeof = function () {
    return _typeof.apply(this.prototype, arguments);
};

Klass.prototype.typeof = function ( klass ) {
    return _typeof.apply(this, arguments);
};

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

module.exports = Klass;

function _typeof ( klass ) {
    return this.constructor.name === klass ||
        this.super.hasOwnProperty( klass );
}