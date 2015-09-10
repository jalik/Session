/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function () {
    'use strict';

    /**
     * Contains session data
     */
    var data = {};

    /**
     * Session object
     * @constructor
     */
    window.Session = {
        /**
         * The domain where the values are stored
         */
        domain: null,

        /**
         * The default expiration time
         */
        expires: null,

        /**
         * The path where the values are stored
         */
        path: '/',

        /**
         * Removes all cookies
         */
        clear: function () {
            data = {};
            var cookies = this.getCookies();

            for (var name in cookies) {
                if (cookies.hasOwnProperty(name)) {
                    this.remove(name);
                }
            }
        },

        /**
         * Creates a cookie
         * @param name
         * @param value
         * @param expires
         * @param path
         * @param domain
         */
        createCookie: function (name, value, expires, path, domain) {
            if (value == null) {
                value = '';
            }
            // Stringify the object
            if (typeof  value === 'object') {
                if (value instanceof Date) {
                    value = 'DATE:' + value.getTime();
                } else {
                    value = 'JSON:' + encodeURIComponent(JSON.stringify(value));
                }
            }
            // Prepare the value
            var cookie = name + '=' + value;

            // Define the expiration date
            if (typeof expires === 'number') {
                cookie += '; expires=' + new Date(expires).toUTCString();
            } else if (expires instanceof Date) {
                cookie += '; expires=' + expires.toUTCString();
            }
            // Define the path
            if (typeof path === 'string') {
                cookie += '; path=' + path;
            }
            // Define the domain
            if (typeof domain === 'string') {
                cookie += '; domain=' + domain;
            }
            document.cookie = cookie;
        },

        /**
         * Deletes a cookie
         * @param name
         * @param path
         * @param domain
         */
        deleteCookie: function (name, path, domain) {
            this.createCookie(name, '', 0, path, domain);
        },

        /**
         * Checks if the value exists
         * @param name
         * @return {boolean}
         */
        exists: function (name) {
            return data[name] !== undefined;
        },

        /**
         * Returns a stored value
         * @param name
         * @param defaultValue
         * @return {*}
         */
        get: function (name, defaultValue) {
            var value = data[name];
            return value !== null && value !== undefined ? value : defaultValue;
        },

        /**
         * Returns a cookie
         * @param name
         * @return {*}
         */
        getCookie: function (name) {
            var cookies = this.getCookies();
            return cookies && cookies[name];
        },

        /**
         * Returns all cookies
         * @return {{}}
         */
        getCookies: function () {
            var array = document.cookie.split('; ');
            var cookies = {};

            for (var i = 0; i < array.length; i += 1) {
                var cookie = array[i].split('=');
                if (typeof cookie[0] === 'string' && cookie[0].length > 0) {
                    cookies[cookie[0]] = cookie[1];
                }
            }
            return cookies;
        },

        /**
         * Loads session data
         * @return {{}}
         */
        load: function () {
            var cookies = Session.getCookies();

            for (var name in cookies) {
                if (cookies.hasOwnProperty(name)) {
                    var value = cookies[name];

                    // Parse object
                    if (value.indexOf('JSON:') === 0) {
                        value = JSON.parse(decodeURIComponent(value.substr(5)));

                    } else if (value.indexOf('DATE:') === 0) {
                        value = new Date(parseInt(value.substr(5)));
                    }
                    data[name] = value;
                }
            }
            return data;
        },

        /**
         * Removes a stored value
         * @param name
         */
        remove: function (name) {
            delete data[name];
            this.deleteCookie(name, this.path, this.domain);
        },

        /**
         * Stores a value
         * @param name
         * @param value
         */
        set: function (name, value) {
            data[name] = value;
            this.createCookie(name, value, this.expires, this.path, this.domain);
        }
    };

    // Load cookies
    Session.load();

})();