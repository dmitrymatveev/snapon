/** @module snapon/util */

/**
 * A mixin function. Copies properties of the source into origin without overritting
 * existing properties.
 *
 * @function copyProperties
 * @param source Source object.
 * @param origin Object to be modified.
 * @param [recursive] Whether to traverse properties recursively or copy as is.
 * @returns {Object} Modified origin object.
 */
module.exports.copyProperties = function copyProperties (source, origin, recursive) {

    var key;
    var next;
    var keys = Object.keys(source);

    recursive = (recursive !== undefined) ? recursive : false;

    for (var i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        next = source[key];

        if (recursive && typeof next === 'object') {
            origin[key] = copyProperties(origin[key] || {}, next);
        }
        else if (origin[key] === undefined) {
            origin[key] = next;
        }
    }

    return origin;
};