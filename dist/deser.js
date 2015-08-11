(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    require('source-map-support').install();
    module.exports = factory();
  } else {
    root.deser = factory();
  }
}(this, function () {
  'use strict';
  function deser(config) {
    return {
      serialize: serialize.bind(config),
      deserialize: deserialize.bind(config)
    };
  }
  module.exports = deser;
  function serialize(data) {
    var result = handleData(data, serializeDoc.bind(this));
    return result;
  }
  function serializeDoc(doc) {
    var result = {};
    for (var key in this.fields) {
      if (this.fields.hasOwnProperty(key)) {
        var val = this.fields[key];
        result[val] = doc[key];
      }
    }
    if (typeof this.serialize === 'function') {
      var serializedDoc = this.serialize(doc);
      for (var key in serializedDoc) {
        if (serializedDoc.hasOwnProperty(key)) {
          var val = serializedDoc[key];
          result[key] = val;
        }
      }
    }
    return result;
  }
  function deserialize(data) {
    var result = handleData(data, deserializeDoc.bind(this));
    return result;
  }
  function deserializeDoc(doc) {
    var result = {};
    for (var key in this.fields) {
      if (this.fields.hasOwnProperty(key)) {
        var val = this.fields[key];
        result[key] = doc[val];
      }
    }
    if (typeof this.deserialize === 'function') {
      var deserializedDoc = this.deserialize(doc);
      for (var key in deserializedDoc) {
        if (deserializedDoc.hasOwnProperty(key)) {
          var val = deserializedDoc[key];
          result[key] = val;
        }
      }
    }
    return result;
  }
  function handleData(data, fn) {
    var result = null;
    // array of docs
    if (data && data instanceof Array) {
      result = data.map(function (doc) {
        return fn(doc);
      });  // single doc
    } else if (typeof data === 'object') {
      result = fn(data);
    } else {
      throw new Error('Bad argument: ', data);
    }
    return result;
  }
  return deser;
}));
//# sourceMappingURL=deser.js.map