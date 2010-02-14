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

    it("should allow local variables in locals", function() {
      var result = JM.render({foo: "bar"}, function() {
        ul({id: foo});
      });

      result.should.equal("<ul id='bar'></ul>");
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

  describe("parser", function() {
    describe("tokenizing", function() {
      before_each(function() {
        compare_arrays = function(array1, array2) {
          array1.toString().should.equal(array2.toString());
        };
      });

      it("should find an empty array of tokens with an empty string", function() {
        // compare_arrays(JM.Clean.tokenize(""), []);
      });

      it("should find one char as a token", function() {
        compare_arrays(JM.Clean.tokenize("u"), [
          ['id', "u"]
        ]);
      });

      it("should find two different words as two tokens", function() {
        compare_arrays(JM.Clean.tokenize("foo bar"), [
          ['id', 'foo'],
          ["id", "bar"]
        ]);
      });

      it("should disregard any whitespace at the start", function() {
        compare_arrays(JM.Clean.tokenize("      foo"), [
          ["id", "foo"]
        ]);
      });

      it("should disregard any whitespace at the start & });", function() {
        compare_arrays(JM.Clean.tokenize("      foo         bar"), [
          ["id", "foo"],
          ["id", "bar"]
        ]);
      });

      it("should disregard newlines (of all sorts) + other whitespace", function() {
        compare_arrays(JM.Clean.tokenize("ul foo\n\r   \tbar"), [
          ["id", "ul"],
          ["id", "foo"],
          ["id", "bar"]
        ]);
      });

      it("should identify an open brace", function() {
        compare_arrays(JM.Clean.tokenize("{"), [
          ["open_brace", "{"]
        ]);
      });

      it("should identify an close brace", function() {
        compare_arrays(JM.Clean.tokenize("}"), [
          ["close_brace", "}"]
        ]);
      });

      it("should identify a colon", function() {
        compare_arrays(JM.Clean.tokenize(":"), [
          ["colon", ":"]
        ]);
      });
    });
  });

  describe("GenericParser", function() {
    before_each(function() {
      parser = JM.Helpers.clone(JM.GenericParser);
    });

    it("should have the token index at 0", function() {
      parser.token_index.should.equal(0);
    });

    it("should have the parser tokens as an empty list by default", function() {
      parser.parser_tokens.toString().should.equal([].toString());
    });

    it("should report on the next token type", function() {
      parser.parser_tokens = [["ID", "foo"]];

      parser.token_index.should.equal(0);
      parser.nextTokenType().should.equal("ID");
    });

    it("should report the correct next token type", function() {
      parser.parser_tokens = [["INTEGER", 1]];
      parser.nextTokenType().should.equal("INTEGER");
    });

    it("should report the correct next token type after the token type has been incremented", function() {
      parser.parser_tokens = [
        ["ID", "foo"],
        ["OPEN_PAREN", "("]
      ];

      parser.incrementToken();

      parser.nextTokenType().should.equal("OPEN_PAREN");
    });

    describe("parsing a token", function() {
      describe("when failing", function() {
        it("should raise an error", function() {
          parser.parser_tokens = [["INT", 1]];

          try {
            parser.parseToken("ID");
          } catch (e) {
            e.should.not.equal(undefined);
          }
        });

        it("should return the old post offset", function() {
          parser.parser_tokens = [["INT", 1]];

          try {
            parser.parseToken("ID");
          } catch (e) {
            e.postOffset.should.equal(0);
          }
        });

        it("should return the old pre offset", function() {
          parser.parser_tokens = [["INT", 1]];

          try {
            parser.parseToken("ID");
          } catch (e) {
            e.preOffset.should.equal(0);
          }
        });

        it("should return the status = false", function() {
          parser.parser_tokens = [["INT", 1]];

          try {
            parser.parseToken("ID");
          } catch (e) {
            e.status.should.equal(false);
          }
        });
      });

      describe("when matching", function() {
        it("should increment the token pointer", function() {
          parser.token_index.should.equal(0);

          parser.parser_tokens = [["ID", "foo"]];
          parser.parseToken("ID");

          parser.token_index.should.equal(1);
        });
      });
    });

    describe("parsing a function", function() {
      it("should run the function", function() {
        var run = false;

        var fun = function() {
          run = true;
        };

        parser.parseFunction(fun);
        run.should.equal(true);
      });

      it("should increment when expecting a token", function() {
        parser.parser_tokens = [["INT", 1]];

        var fun = function() {
          parser.expect("INT");
        };

        parser.parseFunction(fun);
        parser.token_index.should.equal(1);
      });

      it("should increment when expecting two tokens", function() {
        parser.parser_tokens = [["INT", 1], ["INT", 1]];

        var fun = function() {
          parser.expect("INT");
          parser.expect("INT");
        };

        parser.parseFunction(fun);
        parser.token_index.should.equal(2);
      });

      it("should fail, raising an error when not expecting the correct token", function() {
        parser.parser_tokens = [["INT", 1]];

        var fun = function() {
          parser.expect("ID");
        };

        try {
          parser.parseFunction(fun);
        } catch (e) {
          e.should.not.be(undefined);
        }
      });

      it("should fail, rewinding the stack", function() {
        parser.parser_tokens = [["INT", 1], ["INT", 2]];

        var fun = function() {
          parser.expect("INT");
          parser.expect("ID");
        };

        try {
          parser.parseFunction(fun);
        } catch (e) { }

        parser.token_index.should.equal(0);
      });
    });

    describe("matching a token", function() {
      it("should increment when expecting a token", function() {
        parser.parser_tokens = [["INT", 1]];

        var fun = function() {
          parser.match("INT");
        };

        parser.match(fun);
        parser.token_index.should.equal(1);
      });

      it("should parse a token", function() {
        parser.parser_tokens = [["INT", 1]];

        parser.match("INT");
        parser.token_index.should.equal(1);
      });

      it("should have expect as an alias of match", function() {
        parser.expect.should.equal(parser.match);
      });
    });
  });
});
