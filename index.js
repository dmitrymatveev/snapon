/** @module snapon */

/**
 * All exports are wrapped into a function that would require the module only when needed.
 */
module.exports = {

    /**
     * @function
     * @see module:snapon/Klass
     */
    Klass : requireOnDemand.bind(this, './lib/Klass'),

    /**
     * @function
     * @see module:snapon/util
     */
    util : requireOnDemand.bind(this, './lib/util')
};

function requireOnDemand (path) {
    return require(path);
}