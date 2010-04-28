
# JM === "Javascript Markup"

JM is Javascript Markup.  It's a Markaby/Builder for Javascript.

## Examples:

self-closing tags:

  JM.render(function() { img(); });
  => <img />

tags with attributes:

  JM.render(function() {
    div({id: 'bar'});
  });
  // => <div id='bar'></div>

Nested tags:

  JM.render(function() {
    ul(function() {
      li(function() {
        text("hello")
      })
    })
  })

  // =>
    <ul>
      <li>hello</li>
    </ul>

Notice that the "text" method is a way to output raw text into the buffer.
It's an "escape hatch" of sorts.

JM.render can also take an object/hash of locals:

  JM.render({user_name: 'scott'}, function() {
    text(user_name);
  });
  // => "scott"

## Partials:

Since templates are just functions, partials can be passed in as locals:

  var my_partial = function() {
    li(function() {
      text(name)
    });
  };

  JM.render({partial: my_partial}, function() {
    my_partial("scott");
  });

  # => "<li>scott</li>"

The JM library provides a more idiomatic way, which involves registering the partial template:

  JM.register("my_partial", function() {
    li(function() {
      text(name)
    });
  });

  JM.render(function() {
    render("my_partial", {name: 'scott'})
  });


## Bugs:

* Variables that appear in local scope aren't.  They must either be
registered as templates, or passed in as locals:

    var x = 10;

    JM.render(function() {
      text(x);
    });

    // => ERROR

* At the present time, JM doesn't perform w3c validation, as markaby can (optionally).
* It suffers from the same performance constraints that markaby does, namely, that
it doesn't compile the templates.  How real this performance bottle neck is, is TBD.

## License

(The MIT License)

Copyright (c) 2009-2010 Scott Taylor &lt;scott@railsnewbie.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.