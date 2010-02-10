var sys = require("sys");

JM = (function() {
  var builder;

  function properties_for(obj, fun) {
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

  builder = function() {
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
            properties_for(arguments[0], function(key, value) {
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

  return {
    Builder: builder()
  };
})();