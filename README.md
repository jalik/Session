# Session.js

A session is a container where you store the values you want.
All values are stored in a raw format on the client using cookies, so no server is needed.

**Warning : Because it uses cookies, it is not recommended to store sensible data in the session.**

## Set a value

To define a value, use **Session.set(name, value)**.
You can pass any type of variable, it will be serialized in JSON if needed.

```js
Session.set('color', 'blue');
Session.set('user', {uid: 47, name: 'Hitman'});
```

## Get a value

To get a value, use **Session.get(name, defaultValue)**.
You can pass a default value that will be used if the value is undefined.

```js
Session.get('color', 'white');
```

## Check if a value exists

You can check if a value is defined by using **Session.exists(name)**.
It will return a boolean.

```js
if (Session.exists('color')) {
  alert('Color is defined');
}
```

## Remove a value

To delete a value, use **Session.remove(name)**.
It will be instantly removed from the session and will not exist anymore if you reload the page.

```js
Session.remove('color');
```

## Clear all values

To delete all values from the session, use **Session.clear()**.
This method has the same effect than using **Session.remove(name)** on every values.

```js
Session.clear();
```