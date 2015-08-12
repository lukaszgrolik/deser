(function(root, factory) {
  var libName = 'deser';

  if (typeof define === 'function' && define.amd) {
    define(libName, [], function() {
      return factory();
    });
  } else if (typeof module === 'object' && module && typeof module.exports === 'object') {
    require('source-map-support').install();

    module.exports = factory();
  } else {
    root[libName] = factory();
  }
}(this, function() {
  %= body %

  return deser;
}));