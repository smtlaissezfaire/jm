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

  describe "GenericParser"
    before_each
      parser = JM.Helpers.clone(JM.GenericParser);
    end

    it "should have the token index at 0"
      parser.token_index.should.equal(0);
    end

    it "should have the parser tokens as an empty list by default"
      parser.parser_tokens.toString().should.equal([].toString());
    end

    it "should report on the next token type"
      parser.parser_tokens = [["ID", "foo"]];

      parser.token_index.should.equal(0);
      parser.nextTokenType().should.equal("ID");
    end

    it "should report the correct next token type"
      parser.parser_tokens = [["INTEGER", 1]];
      parser.nextTokenType().should.equal("INTEGER");
    end

    it "should report the correct next token type after the token type has been incremented"
      parser.parser_tokens = [
        ["ID", "foo"],
        ["OPEN_PAREN", "("]
      ];

      parser.incrementToken();

      parser.nextTokenType().should.equal("OPEN_PAREN");
    end

    describe "parsing a token"
      describe "when failing"
        it "should raise an error"
          parser.parser_tokens = [["INT", 1]];

          try {
            parser.parseToken("ID");
          } catch (e) {
            e.should.not.equal(undefined);
          }
        end

        it "should return the old post offset"
          parser.parser_tokens = [["INT", 1]];

          try {
            parser.parseToken("ID");
          } catch (e) {
            e.postOffset.should.equal(0);
          }
        end

        it "should return the old pre offset"
          parser.parser_tokens = [["INT", 1]];

          try {
            parser.parseToken("ID");
          } catch (e) {
            e.preOffset.should.equal(0);
          }
        end

        it "should return the status = false"
          parser.parser_tokens = [["INT", 1]];

          try {
            parser.parseToken("ID");
          } catch (e) {
            e.status.should.equal(false);
          }
        end
      end

      describe "when matching"
        it "should increment the token pointer"
          parser.token_index.should.equal(0);

          parser.parser_tokens = [["ID", "foo"]];
          parser.parseToken("ID");

          parser.token_index.should.equal(1);
        end
      end
    end

    describe "parsing a function"
      it "should run the function"
        var run = false;

        var fun = function() {
          run = true;
        }

        parser.parseFunction(fun);
        run.should.equal(true);
      end

      it "should increment when expecting a token"
        parser.parser_tokens = [["INT", 1]];

        var fun = function() {
          parser.expect("INT");
        };

        parser.parseFunction(fun);
        parser.token_index.should.equal(1);
      end

      it "should increment when expecting two tokens"
        parser.parser_tokens = [["INT", 1], ["INT", 1]];

        var fun = function() {
          parser.expect("INT");
          parser.expect("INT");
        };

        parser.parseFunction(fun);
        parser.token_index.should.equal(2);
      end

      it "should fail, raising an error when not expecting the correct token"
        parser.parser_tokens = [["INT", 1]];

        var fun = function() {
          parser.expect("ID");
        };

        try {
          parser.parseFunction(fun);
        } catch (e) {
          e.should.not.be(undefined);
        }
      end

      it "should fail, rewinding the stack"
        parser.parser_tokens = [["INT", 1], ["INT", 2]];

        var fun = function() {
          parser.expect("INT");
          parser.expect("ID");
        };

        try {
          parser.parseFunction(fun);
        } catch (e) { }

        parser.token_index.should.equal(0);
      end
    end

    describe "matching a token"
      it "should increment when expecting a token"
        parser.parser_tokens = [["INT", 1]];

        var fun = function() {
          parser.match("INT");
        };

        parser.match(fun);
        parser.token_index.should.equal(1);
      end

      it "should parse a token"
        parser.parser_tokens = [["INT", 1]];

        parser.match("INT");
        parser.token_index.should.equal(1);
      end

      it "should have expect as an alias of match"
        parser.expect.should.equal(parser.match);
      end
    end
  end
end
