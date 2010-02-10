var sys = require("sys");

JM = (function() {
  var builder;
  var jm;

  function each_property(obj, fun) {
    var accumulator = "",
        value,
        property;

    for (property in obj) {
      if (obj.hasOwnProperty(property)) {
        value = obj[property];

        accumulator += fun(property, value);
      }
    }

    return accumulator;
  }

  mk_builder = function() {
    var obj = {},
        ref,
        tag,
        string,
        x,
        self_closing_tags = ['ul', 'li'];

    for ( ref in self_closing_tags ) {
      tag = self_closing_tags[ref];

      (function(tag) {
        obj[tag] = function() {
          string = "<" + tag;

          if (arguments && arguments.length != 0) {
            each_property(arguments[0], function(key, value) {
              string += " ";
              string += key + "=" + "'" + value + "'";
            });
          }

          string += ">";

          if (arguments.length == 2) {
            sys.puts("arguments" + arguments[1]);
            for (x in arguments[1]) {
              string += arguments[1][x];
            }
          }

          string += "</" + tag + ">";
          return string;
        };
      })(tag);
    };

    return obj;
  };

  jm = {
    Builder: function() {}
  };

  jm.Builder.prototype = mk_builder();

  return jm;
})();