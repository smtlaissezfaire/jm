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
    describe "eachOf"
      it("should yield the element when the function takes only one element", function() {
        var collection = [1];
        var results;

        JM.Helpers.eachOf(collection, function(e) {
          results = e;
        });

        results.should.equal(1);
      });

      it("should yield the key and value when the function takes two elements", function() {
        var collection = [1];

        var key_received;
        var value_received;

        JM.Helpers.eachOf(collection, function(key, value) {
          key_received   = key;
          value_received = value;
        });

        key_received.should.equal("0");
        value_received.should.equal(1);
      });

      it("should include keys of 'falsy' values", function() {
        var collection = [false];
        var results;

        JM.Helpers.eachOf(collection, function(e) {
          results = e;
        });

        results.should.equal(false);
      });
    end
  end
end
