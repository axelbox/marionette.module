var _ = require('underscore'),
Backbone = require('backbone');

// Callbacks
// ---------

// A simple way of managing a collection of callbacks
// and executing them at a later point in time, using jQuery's
// `Deferred` object.
module.exports = Callbacks = function() {
  this._deferred = Backbone.$.Deferred();
  this._callbacks = [];
};

_.extend(Callbacks.prototype, {

  // Add a callback to be executed. Callbacks added here are
  // guaranteed to execute, even if they are added after the
  // `run` method is called.
  add: function(callback, contextOverride) {
    var promise = _.result(this._deferred, 'promise');

    this._callbacks.push({cb: callback, ctx: contextOverride});

    promise.then(function(args) {
      if (contextOverride){ args.context = contextOverride; }
      callback.call(args.context, args.options);
    });
  },

  // Run all registered callbacks with the context specified.
  // Additional callbacks can be added after this has been run
  // and they will still be executed.
  run: function(options, context) {
    this._deferred.resolve({
      options: options,
      context: context
    });
  },

  // Resets the list of callbacks to be run, allowing the same list
  // to be run multiple times - whenever the `run` method is called.
  reset: function() {
    var callbacks = this._callbacks;
    this._deferred = Backbone.$.Deferred();
    this._callbacks = [];

    _.each(callbacks, function(cb) {
      this.add(cb.cb, cb.ctx);
    }, this);
  }
});
