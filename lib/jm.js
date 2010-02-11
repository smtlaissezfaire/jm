JM = {
  major: 0,
  minor: 0,
  tiny:  1
};

JM.version = JM.major + "." + JM.minor + "." + JM.tiny;

JM.Helpers = {
  each_property: function(obj, fun) {
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
};

JM.render = function(locals, code) {
  var builder = new JM.Builder;

  if (code instanceof Function) {
    code = "(" + code.toString() + ")();";
  }

  code = "with(locals) { with(builder) { " + code + " } }";
  eval(code);

  return builder.toHTML();
};

JM.Builder = function() {
  if (this instanceof JM.Builder) {
    this.__output = "";
    return this;
  } else {
    return new JM.Builder;
  }
};

JM.Builder.prototype = (function() {
  var obj = {},
      ref,
      tag,
      string,
      x,
      self_closing_tags = ['ul', 'li'];

  function new_tag(tag_name, pairs, self_closing, body) {
    var string;
    var x;

    string = "<" + tag_name;

    if (pairs) {
      JM.Helpers.each_property(pairs, function(key, value) {
        string += " ";
        string += key + "=" + "'" + value + "'";
      });
    }

    string += ">";

    if (body) {
      for (x in body) {
        string += body[x];
      }
    }

    string += "</" + tag_name + ">";
    return string;
  }

  for ( ref in self_closing_tags ) {
    tag = self_closing_tags[ref];

    (function(tag) {
      obj[tag] = function() {
        return this.__output = new_tag(tag, arguments[0], false, arguments[1]);
      };
    })(tag);
  };

  obj.toHTML = function() {
    return this.__output;
  };

  return obj;
})();