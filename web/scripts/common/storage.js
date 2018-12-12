module.exports = {
  scope: 'heinz',
  name: 'storage',
  dependencies: ['JSON', 'storage-engine'], // localStorage
  factory: function (JSON, storage) {
    'use strict'

    var self = {
      exists: exists,
      get: get,
      set: set,
      remove: remove,
      clear: clear
    }

    function makeKey (key) {
      return key
    }

    function exists (key) {
      return (storage.getItem(makeKey(key)) !== null)
    }

    function get (key) {
      var item = storage.getItem(makeKey(key))

      if (typeof item === 'string') {
        try {
          return JSON.parse(item).payload
        } catch (e) {
          return item
        }
      } else {
        return item
      }
    }

    function set (key, val) {
      storage.setItem(makeKey(key), JSON.stringify({ payload: val }))
    }

    function remove (key) {
      storage.removeItem(makeKey(key))
    }

    function clear () {
      storage.clear()
    }

    return self
  }
}
