var jm = {
  major: 0,
  minor: 0,
  tiny:  1
};

jm.version = jm.major + "." + jm.minor + "." + jm.tiny;

jm.Helpers = {
  forEach: function(obj, fun) {
    var value_only = true,
        x;

    if (fun.length == 2)
      value_only = false;

    for (x in obj) {
      value_only ? fun(obj[x]) : fun(x, obj[x]);
    }
  },

  forEachProperty: function(obj, fun) {
    var property;

    jm.Helpers.forEach(obj, function(key, value) {
      if (obj.hasOwnProperty(key)) {
        fun(key, value);
      }
    });
  },

  map: function(collection, fun) {
    var new_collection = [];

    jm.Helpers.forEach(collection, function(element) {
      new_collection.push(fun(element));
    });

    return new_collection;
  },

  stringMultiply: function(string, size) {
    return new Array(size + 1).join(" ");
  },

  clone: function(prototype) {
    function F() {}
    F.prototype = prototype;
    return new F();
  }
};

jm.render = function(locals, code) {
  if (typeof(code) === 'undefined') {
    if (locals instanceof Function) {
      code = locals;
      locals = {};
    } else {
      throw new Error("Incorrect arguments given to render.");
    }
  }

  var builder = new jm.Builder;

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

jm.Builder = function() {
  if (this instanceof jm.Builder) {
    return this;
  } else {
    return new jm.Builder;
  }
};

jm.Builder.selfClosingTags = [
  'base',
  'meta',
  'link',
  'hr',
  'br',
  'param',
  'img',
  'area',
  'input',
  'col',
  'frame'
];

jm.Builder.blockTags = [
  'html',
  'head',
  'title',
  'style',
  'script',
  'noscript',
  'body',
  'div',
  'p',
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',
  'address',
  'pre',
  'blockquote',
  'ins',
  'del',
  'a',
  'span',
  'bdo',
  'em',
  'strong',
  'dfn',
  'code',
  'samp',
  'kbd',
  'var',
  'cite',
  'abbr',
  'acronym',
  'q',
  'sub',
  'sup',
  'tt',
  'i',
  'b',
  'big',
  'small',
  'object',
  'map',
  'form',
  'label',
  'select',
  'optgroup',
  'option',
  'textarea',
  'fieldset',
  'legend',
  'button',
  'table',
  'caption',
  'colgroup',
  'thead',
  'tfoot',
  'tbody',
  'tr',
  'th',
  'td',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strike',
  'center',
  'dir',
  'noframes',
  'basefont',
  'u',
  'menu',
  'iframe',
  'font',
  's',
  'applet',
  'isindex',
  'script',
  'a',
  'td',
  'h5',
  'h3',
  'li',
  'div',
  'pre',
  'body',
  'ol',
  'h4',
  'h2',
  'object',
  'legend',
  'dl',
  'h6',
  'ul',
  'form',
  'h1'
];

jm.Builder.prototype = (function() {
  var builder = {},
      forEach           = jm.Helpers.forEach,
      forEachProperty   = jm.Helpers.forEachProperty;

  builder.concat = function(str) {
    this.buffer += str;
  };

  builder.text = builder.concat;

  builder.indent = function() {
    if (this.indentation) {
      this.indentation_level += this.indentation_spaces;

      this.concat("\n");
      this.concat(jm.Helpers.stringMultiply(" ", this.indentation_level));
    }
  };

  builder.outdent = function() {
    if (this.indentation) {
      this.indentation_level -= this.indentation_spaces;

      this.concat("\n");
      this.concat(jm.Helpers.stringMultiply(" ", this.indentation_level));
    }
  };

  builder.node = function(tag_name, pairs, self_closing, body) {
    var string = "";
    var x;

    string += "<" + tag_name;

    if (pairs) {
      forEachProperty(pairs, function(key, value) {
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

  forEach(jm.Builder.blockTags, function(tag) {
    builder[tag] = function() {
      return this.node(tag, arguments[0], false, arguments[1]);
    };
  });

  forEach(jm.Builder.selfClosingTags, function(tag) {
    builder[tag] = function() {
      return this.node(tag, arguments[0], true);
    };
  });

  builder.toHTML = function() {
    return this.buffer;
  };

  builder.buffer             = "";
  builder.indentation        = false;
  builder.indentation_level  = 0;
  builder.indentation_spaces = 2;

  return builder;
})();

if (typeof(exports) === 'object') {
  for (key in jm) {
    if (jm.hasOwnProperty(key)) {
      exports[key] = jm[key];
    }
  }
}