/** @module snapon/Klass */

var util = require('./util');

/**
 * Flattened, prototype copy based approach to implementing inheritance in JavaScript.
 * Instead of extending the prototype of the parent this Klass copies properties and
 * methods instead creating a flattened inheritance model which is not a chain anymore.
 *
 * Initial idea and code that I later re-factored and added to was shamelessly
 * stolen ( with a permission I mind you :) ) from my work colleague
 * [Lee Grey]{@link https://github.com/lee-nk}.
 *
 * @class Klass
 * @constructor
 */
function Klass () {}
module.exports = Klass;

/**
 * Holds prototypes of all parents as a result of calling Klass.extend and Klass.implement.
 * @type {Object}
 */
Klass.prototype.super = {};

/**
 * Returns true if specified string matches any of the parent classes.
 *
 * @example
 *      Klass.isTypeof(Klass);
 *
 * @param {Function} klassType Constructor function
 * @returns {Boolean}
 */
Klass.isTypeof = function (klassType) {
    return this.name === klassType.name ||
            this.prototype.super.hasOwnProperty(klassType.name);
};

/**
 * Returns true if specified string matches any of the parent classes.
 * @param {Function} klassType Constructor function
 * @returns {Boolean}
 */
Klass.prototype.isInstanceOf = function (klassType) {
    return this.constructor === klassType ||
            this.super.hasOwnProperty(klassType.name);
};

/**
 * Extends provided constructor function with own static and prototype properties.
 *
 * @param {Function} constructorFunction Child to be extended with this type.
 * @param {Object} [options] Control what ends up being extended into child.
 * @param {Boolean} options.final Removes 'extend' function from resulting child type.
 *
 * @returns {Function} constructorFunction Modified child type.
 */
Klass.extend = function (constructorFunction, options) {

    var func = constructorFunction;
    if ( !func || typeof func !== 'function') {
        throw new Error('Constructor Function is missing.');
    }

    var name = func.prototype.constructor.name;
    if ( name.length < 1 ) {
        throw new Error('Constructor Function must have "constructor" name.');
    }

    var opts = util.copyProperties({ final : false }, options || {});

    inherit( func, this );

    if ( opts.final ) {
        delete func['extend'];
    }

    func.prototype.super[ this.prototype.constructor.name ] = this.prototype;

    return func;
};

/**
 * Similar to Klass.extend but works the other way around. Implements static and
 * prototype properties found in provided constructor function into own type.
 *
 * @param {Function} constructorFunction Parent type to be implemented.
 */
Klass.implement = function (constructorFunction) {

    var func = constructorFunction;
    if ( !func || typeof func !== 'function' ) {
        throw new Error('Constructor Function is missing.');
    }

    var name = func.prototype.constructor.name;
    if ( name.length < 1 ) {
        throw new Error('Constructor Function must have "constructor" name.');
    }

    inherit(this, func);

    this.prototype.super[ func.prototype.constructor.name ] = func.prototype;
};

/**
 * Inherits properties of the provided object into own prototype.
 *
 * This function differs from Klass.extend and Klass.implement such that the provided
 * parent object does not leave a record in this type's super hash, and serves as a quick
 * way to copy over some properties from object literals.
 *
 * @param {Object} tobeAnObject Object instance to copy properties from.
 */
Klass.assume = function (tobeAnObject) {
    if (typeof tobeAnObject === "object") {
        inherit(this, tobeAnObject);
    }
};

/*
    Copies properties and prototype properties over into the constructor function.
    TODO: re-factor to make this function arguments explicit.

    First argument is a target constructor function
    Followed by a list of source types that can be either function or object literals.
 */
function inherit () {

    if( arguments.length < 2 ) return;

    var target = arguments[ 0 ];

    var i, name, parent;

    for ( i = 1; i < arguments.length; i++ ) {

        parent = arguments[ i ];

        // If parent is a function, copy
        // from parent.prototype into the target.prototype:
        if( typeof parent === 'function' ) {

            for ( name in parent.prototype ) {

                if (!parent.prototype.hasOwnProperty(name)) continue;

                if ( typeof parent.prototype[ name ] === 'object' ) {

                    target.prototype[ name ] =
                        util.copyProperties( parent.prototype[ name ], {}, true );
                }
                else {

                    target.prototype[ name ] = parent.prototype[ name ];
                }

            }

            // copy props from parent into the target
            // ( ie static vars and methods )
            for ( name in parent ) {

                if (!parent.hasOwnProperty(name)) continue;

                target[ name ] = parent[ name ];
            }

        }
        //if it is an object, apply to the prototype
        else if( typeof parent === 'object' ) {
            for ( name in parent ) {

                if (!parent.hasOwnProperty(name)) continue;

                target.prototype[ name ] = parent[ name ];
            }
        }

    }

}