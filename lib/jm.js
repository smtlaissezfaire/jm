JM = {
  major: 0,
  minor: 0,
  tiny:  1
};

JM.version = JM.major + "." + JM.minor + "." + JM.tiny;

JM.Helpers = {
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

    JM.Helpers.forEach(obj, function(key, value) {
      if (obj.hasOwnProperty(key)) {
        fun(key, value);
      }
    });
  },

  map: function(collection, fun) {
    var new_collection = [];

    JM.Helpers.forEach(collection, function(element) {
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

JM.Builder.selfClosingTags = [
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

JM.Builder.blockTags = [
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

JM.Builder.prototype = (function() {
  var builder = {},
      forEach           = JM.Helpers.forEach,
      forEachProperty   = JM.Helpers.forEachProperty;

  builder.concat = function(str) {
    this.buffer += str;
  };

  builder.text = builder.concat;

  builder.indent = function() {
    if (this.indentation) {
      this.indentation_level += this.indentation_spaces;

      this.concat("\n");
      this.concat(JM.Helpers.stringMultiply(" ", this.indentation_level));
    }
  };

  builder.outdent = function() {
    if (this.indentation) {
      this.indentation_level -= this.indentation_spaces;

      this.concat("\n");
      this.concat(JM.Helpers.stringMultiply(" ", this.indentation_level));
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

  forEach(JM.Builder.blockTags, function(tag) {
    builder[tag] = function() {
      return this.node(tag, arguments[0], false, arguments[1]);
    };
  });

  forEach(JM.Builder.selfClosingTags, function(tag) {
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