(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    require('source-map-support').install();

    module.exports = factory();
  } else {
    root.deser = factory();
  }
}(this, function() {
  %= body %
  return deser;
}));