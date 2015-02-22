/** @module snapon */

/**
 * All exports are wrapped into a function that would require the module only when needed.
 */
module.exports = {

    /**
     * @function
     * @see module:snapon/Klass
     */
    Klass : require('./lib/Klass'),

    /**
     * @function
     * @see module:snapon/util
     */
    util : require('./lib/util')
};