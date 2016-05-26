(function (window) {
  "use strict";

  /*global Map:true*/
  if (!Map) window.Map = AdaptableMap;

  /**
   * @constructor AdaptableMap
   *
   * @description - simple shim for ES6 Map, Do Not Use It directly
   */
  function AdaptableMap() {
    this.storage = {};
  }

  AdaptableMap.prototype.has = function (identity) {
    return this.storage.hasOwnProperty(identity);
  };

  AdaptableMap.prototype.get = function (identity) {
    return this.storage[identity];
  };

  AdaptableMap.prototype.set = function (identity, instance) {
    this.storage[identity] = instance;
  };

  AdaptableMap.prototype.delete = function (identity) {
    if (this.has(identity)) delete this.storage[identity];
  };

  Object.defineProperty(AdaptableMap.prototype, "size", {
    enumerable: true,
    configurable: false,
    get: function () {
      return Object.keys(this.storage).length;
    }
  });
})(window);