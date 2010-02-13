describe "JM"
  describe "Builder"
    before_each
      builder = new JM.Builder;
    end

    it "should be a builder"
      (builder instanceof JM.Builder).should.equal(true);
    end

    it "should be a builder even if missing the new"
      (JM.Builder() instanceof JM.Builder).should.equal(true);
    end

    it 'should close a tag'
      builder.ul().should.equal("<ul></ul>");
    end

    it 'should add the tag contents to the buffer'
      builder.ul();
      builder.buffer.should.equal("<ul></ul>");
    end

    it "should use an argument given"
      builder.ul({foo: "bar"}).should.equal("<ul foo='bar'></ul>")
    end

    it "should use the correct argument"
      builder.ul({bar: "quxx"}).should.equal("<ul bar='quxx'></ul>")
    end

    it "should use multiple arguments"
      builder.ul({foo: "bar", baz: "quxx"}).should.equal("<ul foo='bar' baz='quxx'></ul>");
    end

    it "should close a li"
      builder.li().should.equal("<li></li>");
    end

    it "should be able to nest"
      var result = builder.ul({"foo": "bar"}, function() {
        builder.li();
      });

      result.should.equal("<ul foo='bar'><li></li></ul>");
    end

    it "should be able to nest multiple elements"
      var result = builder.ul({"foo": "bar"}, function() {
        builder.li();
        builder.li();
      });

      result.should.equal("<ul foo='bar'><li></li><li></li></ul>");
    end

    it "should be able to nest multiple elements when they are different"
      var result = builder.ul({"foo": "bar"}, function() {
        builder.li({foo: "bar"});
        builder.li();
      });

      result.should.equal("<ul foo='bar'><li foo='bar'></li><li></li></ul>");
    end

    it "should have return the html string as toHtml"
      builder.ul({"foo": "bar"});
      builder.toHTML().should.equal("<ul foo='bar'></ul>");
    end

    it "should handle self-closing tags"
      var result = builder.img({src: "/images/foo.jpg"});
      result.should.equal("<img src='/images/foo.jpg' />");
    end

    it "should capture with the text helper"
      var result = builder.p({}, function() {
        builder.text("foo");
      });

      result.should.equal("<p>foo</p>");
    end

    describe "indentation"
      it "should be off by default"
        builder.indentation.should.be(false);
      end

      it "should indent when on"
        builder.indentation = true;

        builder.ul({}, function() {
          builder.li();
        });

        var expected_string = "";
        expected_string += "<ul>\n";
        expected_string += "  <li></li>\n";
        expected_string += "</ul>";

        builder.toHTML().should.equal(expected_string);
      end

      it "should indent multiple levels"
        builder.indentation = true

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
      end

      it "should be able to indent an arbitrary amount of spaces"
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
      end
    end
  end

  describe "render"
    it "should use a pretty syntax"
      var result = JM.render({}, function() {
        ul()
      });

      result.should.equal("<ul></ul>");
    end

    it "should be able to nest"
      var result = JM.render({}, function() {
        ul({}, function() {
          li()
        })
      });

      result.should.equal("<ul><li></li></ul>");
    end

    it "should take code as a string"
      var result = JM.render({}, "ul();");
      result.should.equal("<ul></ul>");
    end

    it "should allow local variables in locals"
      var result = JM.render({foo: "bar"}, function() {
        ul({id: foo});
      });

      result.should.equal("<ul id='bar'></ul>");
    end
  end

  describe "version"
    it "should be at 0.0.1"
      JM.major.should.equal(0)
      JM.minor.should.equal(0)
      JM.tiny.should.equal(1)
      JM.version.should.equal("0.0.1")
    end
  end

  describe "Helpers"
    describe "forEach"
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
    end
  end

  describe "parser"
    describe "tokenizing"
      before_each
        compare_arrays = function(array1, array2) {
          array1.toString().should.equal(array2.toString());
        }
      end

      it "should find an empty array of tokens with an empty string"
        // compare_arrays(JM.Clean.tokenize(""), []);
      end

      it "should find one char as a token"
        compare_arrays(JM.Clean.tokenize("u"), [
          ['id', "u"]
        ]);
      end

      it "should find two different words as two tokens"
        compare_arrays(JM.Clean.tokenize("foo bar"), [
          ['id', 'foo'],
          ["id", "bar"]
        ]);
      end

      it "should disregard any whitespace at the start"
        compare_arrays(JM.Clean.tokenize("      foo"), [
          ["id", "foo"]
        ]);
      end

      it "should disregard any whitespace at the start & end"
        compare_arrays(JM.Clean.tokenize("      foo         bar"), [
          ["id", "foo"],
          ["id", "bar"]
        ]);
      end

      it "should disregard newlines (of all sorts) + other whitespace"
        compare_arrays(JM.Clean.tokenize("ul foo\n\r   \tbar"), [
          ["id", "ul"],
          ["id", "foo"],
          ["id", "bar"]
        ]);
      end

      it "should identify an open brace"
        compare_arrays(JM.Clean.tokenize("{"), [
          ["open_brace", "{"]
        ]);
      end

      it "should identify an close brace"
        compare_arrays(JM.Clean.tokenize("}"), [
          ["close_brace", "}"]
        ]);
      end

      it "should identify a colon"
        compare_arrays(JM.Clean.tokenize(":"), [
          ["colon", ":"]
        ]);
      end
    end
  end
end
