JM = {
  major: 0,
  minor: 0,
  tiny:  1
};

JM.version = JM.major + "." + JM.minor + "." + JM.tiny;

JM.Helpers = {
  eachOf: function(obj, fun) {
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

    JM.Helpers.eachOf(obj, function(key, value) {
      if (obj.hasOwnProperty(key)) {
        fun(key, value);
      }
    });
  },
  string_multiply: function(string, size) {
    return new Array(size + 1).join(" ");
  }
};

JM.render = function(locals, code) {
  var builder = new JM.Builder;

  if (code instanceof Function) {
    code = "(" + code.toString() + ")();";
  }

  eval("                \
    with(locals) {      \
      with(builder) {   \
        " + code + "    \
      }                 \
    };                  \
  ");

  return builder.toHTML();
};

JM.Builder = function() {
  if (this instanceof JM.Builder) {
    return this;
  } else {
    return new JM.Builder;
  }
};

JM.Builder.prototype = (function() {
  var builder = {},
      eachOf            = JM.Helpers.eachOf,
      eachProperty      = JM.Helpers.eachProperty,
      regular_tags      = ['ul', 'li', 'p'],
      self_closing_tags = ['img'];

  builder.concat = function(str) {
    this.buffer += str;
  };

  builder.text = builder.concat;

  builder.indent = function() {
    if (this.indentation) {
      this.indentation_level += 2;

      this.concat("\n");
      this.concat(JM.Helpers.string_multiply(" ", this.indentation_level));
    }
  };

  builder.outdent = function() {
    if (this.indentation) {
      this.indentation_level -= 2;

      this.concat("\n");
      this.concat(JM.Helpers.string_multiply(" ", this.indentation_level));
    }
  };

  builder.node = function(tag_name, pairs, self_closing, body) {
    var string = "";
    var x;

    string += "<" + tag_name;

    if (pairs) {
      eachProperty(pairs, function(key, value) {
        string += " ";
        string += key + "=" + "'" + value + "'";
      });
    }

    if (self_closing) {
      string += " />";
      this.concat(string);
    } else {
      string += ">";
      this.concat(string);

      if (body) {
        this.indent();
        body();
        this.outdent();
      }

      this.concat("</" + tag_name + ">");
    }

    return this.toHTML();
  };

  eachOf(regular_tags, function(tag) {
    builder[tag] = function() {
      return this.node(tag, arguments[0], false, arguments[1]);
    };
  });

  eachOf(self_closing_tags, function(tag) {
    builder[tag] = function() {
      return this.node(tag, arguments[0], true);
    };
  });

  builder.toHTML = function() {
    return this.buffer;
  };

  builder.buffer            = "";
  builder.indentation       = false;
  builder.indentation_level = 0;

  return builder;
})();
