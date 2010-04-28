describe("JM", function() {
  describe("Builder", function() {
    before_each(function() {
      builder = new JM.Builder;
    });

    it("should be a builder", function() {
      (builder instanceof JM.Builder).should.equal(true);
    });

    it("should be a builder even if missing the new", function() {
      (JM.Builder() instanceof JM.Builder).should.equal(true);
    });

    it('should close a tag', function() {
      builder.ul().should.equal("<ul></ul>");
    });

    it('should add the tag contents to the buffer', function() {
      builder.ul();
      builder.buffer.should.equal("<ul></ul>");
    });

    it("should use an argument given", function() {
      builder.ul({foo: "bar"}).should.equal("<ul foo='bar'></ul>");
    });

    it("should use the correct argument", function() {
      builder.ul({bar: "quxx"}).should.equal("<ul bar='quxx'></ul>");
    });

    it("should use multiple arguments", function() {
      builder.ul({foo: "bar", baz: "quxx"}).should.equal("<ul foo='bar' baz='quxx'></ul>");
    });

    it("should close a li", function() {
      builder.li().should.equal("<li></li>");
    });

    it("should be able to nest", function() {
      var result = builder.ul({"foo": "bar"}, function() {
        builder.li();
      });

      result.should.equal("<ul foo='bar'><li></li></ul>");
    });

    it("should be able to nest with just a function argument", function() {
      var result = builder.ul(function() {
        builder.li();
      });

      result.should.equal("<ul><li></li></ul>");
    });

    it("should be able to nest multiple elements", function() {
      var result = builder.ul({"foo": "bar"}, function() {
        builder.li();
        builder.li();
      });

      result.should.equal("<ul foo='bar'><li></li><li></li></ul>");
    });

    it("should be able to nest multiple elements when they are different", function() {
      var result = builder.ul({"foo": "bar"}, function() {
        builder.li({foo: "bar"});
        builder.li();
      });

      result.should.equal("<ul foo='bar'><li foo='bar'></li><li></li></ul>");
    });

    it("should have return the html string as toHtml", function() {
      builder.ul({"foo": "bar"});
      builder.toHTML().should.equal("<ul foo='bar'></ul>");
    });

    it("should handle self-closing tags", function() {
      var result = builder.img({src: "/images/foo.jpg"});
      result.should.equal("<img src='/images/foo.jpg' />");
    });

    it("should capture with the text helper", function() {
      var result = builder.p({}, function() {
        builder.text("foo");
      });

      result.should.equal("<p>foo</p>");
    });

    describe("indentation", function() {
      it("should be off by default", function() {
        builder.indentation.should.be(false);
      });

      it("should indent when on", function() {
        builder.indentation = true;

        builder.ul({}, function() {
          builder.li();
        });

        var expected_string = "";
        expected_string += "<ul>\n";
        expected_string += "  <li></li>\n";
        expected_string += "</ul>";

        builder.toHTML().should.equal(expected_string);
      });

      it("should indent multiple levels", function() {
        builder.indentation = true;

        builder.ul({}, function() {
          builder.li({}, function() {
            builder.p();
          });
        });

        var expected_string = "";
        expected_string += "<ul>\n";
        expected_string += "  <li>\n";
        expected_string += "    <p></p>\n";
        expected_string += "  </li>\n";
        expected_string += "</ul>";

        builder.toHTML().should.equal(expected_string);
      });

      it("should be able to indent an arbitrary amount of spaces", function() {
        builder.indentation = true;
        builder.indentation_spaces = 4;

        builder.ul({}, function() {
          builder.li();
        });

        var expected_string = "";
        expected_string += "<ul>\n";
        expected_string += "    <li></li>\n";
        expected_string += "</ul>";

        builder.toHTML().should.equal(expected_string);
      });
    });
  });

  describe("render", function() {
    it("should use a pretty syntax", function() {
      var result = JM.render({}, function() {
        ul();
      });

      result.should.equal("<ul></ul>");
    });

    it("should be able to nest", function() {
      var result = JM.render({}, function() {
        ul({}, function() {
          li();
        });
      });

      result.should.equal("<ul><li></li></ul>");
    });

    it("should take code as a string", function() {
      var result = JM.render({}, "ul();");
      result.should.equal("<ul></ul>");
    });

    it("should prefer local variables to builder functions", function() {
      var result = JM.render({ul: 'foobar'}, function() {
        text(ul);
      });

      result.should.equal("foobar");
    });

    it("should allow local variables in locals", function() {
      var result = JM.render({foo: "bar"}, function() {
        ul({id: foo});
      });

      result.should.equal("<ul id='bar'></ul>");
    });

    it("should use a one arg function as an empty list of params", function() {
      var result = JM.render(function() {
        ul({id: 'foo'});
      });

      result.should.equal("<ul id='foo'></ul>");
    });

    it("should be able to create a paragraph tag", function() {
      var result = JM.render(function() {
        p();
      });

      result.should.equal("<p></p>");
    });

    it("should raise an error if given one argument, but it's not a function", function() {
      try {
        JM.render({});
        throw("got here");
      } catch (e) {
        e.message.should.equal("Incorrect arguments given to render.");
      }
    });

    it("should be able to access variables given in the current scope through params", function() {
      var partial = function() {
        p();
      };

      var result = JM.render({partial: partial}, function() {
        text(JM.render(partial));
      });

      result.should.equal("<p></p>");
    });
  });

  describe("version", function() {
    it("should be at 0.0.1", function() {
      JM.major.should.equal(0);
      JM.minor.should.equal(0);
      JM.tiny.should.equal(1);
      JM.version.should.equal("0.0.1");
    });
  });

  describe("Helpers", function() {
    describe("forEach", function() {
      it("should yield the element when the function takes only one element", function() {
        var collection = [1];
        var results;

        JM.Helpers.forEach(collection, function(e) {
          results = e;
        });

        results.should.equal(1);
      });

      it("should yield the key and value when the function takes two elements", function() {
        var collection = [1];

        var key_received;
        var value_received;

        JM.Helpers.forEach(collection, function(key, value) {
          key_received   = key;
          value_received = value;
        });

        key_received.should.equal("0");
        value_received.should.equal(1);
      });

      it("should include keys of 'falsy' values", function() {
        var collection = [false];
        var results;

        JM.Helpers.forEach(collection, function(e) {
          results = e;
        });

        results.should.equal(false);
      });
    });
  });
});
