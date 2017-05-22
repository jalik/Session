/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
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

(function (window) {

    /**
     * Contains session data
     */
    let data = {};

    /**
     * Session object
     * @constructor
     */
    const Session = {
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
        path: "/",

        /**
         * Removes all cookies
         */
        clear() {
            data = {};
            const cookies = this.getCookies();

            for (let name in cookies) {
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
        createCookie(name, value, expires, path, domain) {
            if (value === null || value === undefined) {
                value = "";
            }
            // Stringify the object
            if (typeof  value === "object") {
                if (value instanceof Date) {
                    value = "DATE:" + value.getTime();
                } else {
                    value = "JSON:" + encodeURIComponent(JSON.stringify(value));
                }
            }
            // Prepare the value
            let cookie = name + "=" + value;

            // Define the expiration date
            if (typeof expires === "number") {
                cookie += "; expires=" + new Date(expires).toUTCString();
            } else if (expires instanceof Date) {
                cookie += "; expires=" + expires.toUTCString();
            }
            // Define the path
            if (typeof path === "string") {
                cookie += "; path=" + path;
            }
            // Define the domain
            if (typeof domain === "string") {
                cookie += "; domain=" + domain;
            }
            document.cookie = cookie;
        },

        /**
         * Deletes a cookie
         * @param name
         * @param path
         * @param domain
         */
        deleteCookie(name, path, domain) {
            this.createCookie(name, "", 0, path, domain);
        },

        /**
         * Checks if the value exists
         * @param name
         * @return {boolean}
         */
        exists(name) {
            return data[name] !== undefined;
        },

        /**
         * Returns a stored value
         * @param name
         * @param defaultValue
         * @return {*}
         */
        get(name, defaultValue) {
            if (name) {
                const value = data[name];
                return value !== null && value !== undefined ? value : defaultValue;
            } else {
                return this.load();
            }
        },

        /**
         * Returns a cookie
         * @param name
         * @return {*}
         */
        getCookie(name) {
            const cookies = this.getCookies();
            return cookies && cookies[name];
        },

        /**
         * Returns all cookies
         * @return {{}}
         */
        getCookies() {
            const array = document.cookie.split("; ");
            const cookies = {};

            for (let i = 0; i < array.length; i += 1) {
                const cookie = array[i].split("=");

                if (typeof cookie[0] === "string" && cookie[0].length > 0) {
                    cookies[cookie[0]] = cookie[1];
                }
            }
            return cookies;
        },

        /**
         * Returns a JSON value
         * @param name
         * @param defaultValue
         * @returns {*}
         */
        getJSON(name, defaultValue) {
            if (name) {
                const value = data[name];
                return typeof value === "string" ? JSON.parse(value) : defaultValue;
            } else {
                return this.load();
            }
        },

        /**
         * Loads session data
         * @return {{}}
         */
        load() {
            const cookies = this.getCookies();

            for (let name in cookies) {
                if (cookies.hasOwnProperty(name)) {
                    let value = cookies[name];

                    // Parse object
                    if (value.indexOf("JSON:") === 0) {
                        value = JSON.parse(decodeURIComponent(value.substr(5)));

                    } else if (value.indexOf("DATE:") === 0) {
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
        remove(name) {
            delete data[name];
            this.deleteCookie(name, this.path, this.domain);
        },

        /**
         * Stores a value
         * @param name
         * @param value
         */
        set(name, value) {
            data[name] = value;
            this.createCookie(name, value, this.expires, this.path, this.domain);
        }
    };

    // Load session data
    Session.load();

    if (window) {
        window.Session = Session;
    }

})(window);
