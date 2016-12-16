# Session.js

This lib allows you to store any values and keep session state.
All values are stored in a raw format on the client using cookies, so no server is needed.

**Warning : Because it uses cookies, it is not recommended to store sensible data in the session.**

## Setting values

To define a value, use **Session.set(name, value)**.
You can pass any type of variable, it will be serialized in JSON if needed.

```js
Session.set('color', 'blue');
Session.set('happy', true);
Session.set('user', {uid: 47, name: 'Hitman'});
```

## Getting values

To get a value, use `Session.get(name, defaultValue)`.
You can pass a default value that will be used if the value is undefined.

```js
// Get value of color
Session.get('color');
// Or get a default value if color is not set
Session.get('color', 'white');
// Get a JSON value
Session.getJSON('object');
// Get all values of the current session
Session.get();
```

## Checking values

You can check if a value is defined by using `Session.exists(name)`.
It will return a `boolean`.

```js
if (Session.exists('color')) {
  alert('Color is defined');
}
```

## Removing values

To permanently delete a stored value, use `Session.remove(name)`.
It will be instantly removed from the session and will not exist anymore if you reload the page.

```js
Session.remove('color');
```

## Clearing session

To delete all values from the session, use `Session.clear()`.
This method has the same effect than using `Session.remove(name)` on every values.

```js
Session.clear();
```
