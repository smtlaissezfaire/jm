JM = {
  major: 0,
  minor: 0,
  tiny:  1
};

JM.version = JM.major + "." + JM.minor + "." + JM.tiny;

JM.Helpers = {
  each: function(obj, fun) {
    var value_only = true,
        x;

    if (fun.length == 2)
      value_only = false;

    for (x in obj) {
      value_only ? fun(obj[x]) : fun(x, obj[x]);
    }
  },
  eachProperty: function(obj, fun) {
    var property;

    for (property in obj) {
      if (obj.hasOwnProperty(property)) {
        fun(property, obj[property]);
      }
    }
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
      each = JM.Helpers.each,
      eachProperty = JM.Helpers.eachProperty,
      self_closing_tags = ['ul', 'li'];

  function newTag(tag_name, pairs, self_closing, body) {
    var string;
    var x;

    string = "<" + tag_name;

    if (pairs) {
      eachProperty(pairs, function(key, value) {
        string += " ";
        string += key + "=" + "'" + value + "'";
      });
    }

    string += ">";

    if (body) {
      each(body, function(element) {
        string += element;
      });
    }

    string += "</" + tag_name + ">";
    return string;
  }

  each(self_closing_tags, function(tag) {
    obj[tag] = function() {
      return this.__output = newTag(tag, arguments[0], false, arguments[1]);
    };
  });

  obj.toHTML = function() {
    return this.__output;
  };

  return obj;
})();