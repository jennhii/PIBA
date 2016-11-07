(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory();
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.hunt = factory();
    }
})(this, function() {
    'use strict';

    var huntedElements = [],
        viewport = window.innerHeight,
        THROTTLE_INTERVAL = 100;

    /**
     * Constructor for element that should be hunted
     * @constructor Hunted
     * @param {Node} element
     * @param {Object} config
     */
    var Hunted = function(element, config) {
        this.element = element;

        // instantiate element as not visible
        this.visible = false;

        for (var prop in config) {
            if (config.hasOwnProperty(prop)) {
                this[prop] = config[prop];
            }
        }
    };

    // by default offset is zero
    Hunted.prototype.offset = 0;

    // by default trigger events only once
    Hunted.prototype.persist = false;

    // fallback in function to avoid sanity check
    Hunted.prototype.in = function() {};

    // fallback out function to avoid sanity check
    Hunted.prototype.out = function() {};

    /**
     * Adds one or more elements to the hunted elements array
     * @method add
     * @param {Array|Node} elements
     * @param {Object} options
     */
    var add = function(elements, options) {
        // sanity check of arguments
        if (elements instanceof Node === false
                && typeof elements.length !== 'number'
                || typeof options !== 'object') {
            throw new TypeError('Arguments must be an element or a list of them and an object');
        }

        // treat single node as array
        if (elements instanceof Node === true) {
            elements = [ elements ];
        }

        var i = 0,
            len = elements.length;

        // add elements to general hunted array
        for (; i < len; i++) {
            huntedElements.push(new Hunted(elements[i], options));
        }

        // check if recently added elements are visible
        huntElements();

        i = len = null;
    };

    /**
     * Updates viewport and elements metrics
     * @method updateMetrics
     */
    var updateMetrics = function() {
        viewport = window.innerHeight;

        // check if new elements became visible
        huntElements();
    };

    /**
     * Checks if hunted elements are visible and resets ticking
     * @method huntElements
     */
    var huntElements = function() {
        var len = huntedElements.length,
            hunted,
            rect;

        while (len) {
            --len;

            hunted = huntedElements[len];
            rect = hunted.element.getBoundingClientRect();

            /*
             * trigger (in) event if element comes from a non visible state and the scrolled viewport has
             * reached the visible range of the element without exceeding it
             */
            if (!hunted.visible
                    && rect.top - hunted.offset < viewport
                    && rect.top >= -(rect.height + hunted.offset)) {
                hunted.in.apply(hunted.element);
                hunted.visible = true;
            }

            /*
             * trigger (out) event if element comes from a visible state and it's out of the visible
             * range its bottom or top limit
             */
            if (hunted.visible
                    && (rect.top - hunted.offset >= viewport
                    || rect.top <= -(rect.height + hunted.offset))) {
               hunted.out.apply(hunted.element);
               hunted.visible = false;

                // when hunting should not persist kick element out
                if (!hunted.persist) {
                   huntedElements.splice(len, 1);
                }
            }
        }

        hunted = len = null;
    };

    /**
     * Prevents overcall during global specified interval
     * @method throttle
     * @param {Function} fn
     * @returns {Function}
     */
    var throttle = function(fn) {
        var timer = null;

        return function () {
            if (timer) {
                return;
            }
            timer = setTimeout(function () {
                fn.apply(this, arguments);
                timer = null;
            }, THROTTLE_INTERVAL);
        };
    };

    // on resize update viewport metrics
    window.addEventListener('resize', throttle(updateMetrics));

    // on scroll check for elements position and trigger methods
    window.addEventListener('scroll', throttle(huntElements));

    return add;
});
