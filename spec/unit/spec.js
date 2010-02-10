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

    it 'should self-close a tag'
      builder.ul().should.equal("<ul></ul>");
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

    it "should self-close a li"
      builder.li().should.equal("<li></li>");
    end

    it "should be able to nest"
      var result = builder.ul({"foo": "bar"}, [
        builder.li()
      ]);

      result.should.equal("<ul foo='bar'><li></li></ul>");
    end

    it "should be able to nest multiple elements"
      var result = builder.ul({"foo": "bar"}, [
        builder.li(),
        builder.li()
      ]);

      result.should.equal("<ul foo='bar'><li></li><li></li></ul>");
    end

    it "should be able to nest multiple elements when they are different"
      var result = builder.ul({"foo": "bar"}, [
        builder.li({foo: "bar"}),
        builder.li()
      ]);

      result.should.equal("<ul foo='bar'><li foo='bar'></li><li></li></ul>");
    end

    it "should have return the html string as toHtml"
      builder.ul({"foo": "bar"});
      builder.toHTML().should.equal("<ul foo='bar'></ul>");
    end

    // pending:
    // it "should handle self-closing tags"
    //   var result = JM.Builder.img({src: "/images/foo.jpg"});
    //   result.should.equal("<img src='/images/foo.jpg' />");
    // end
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
        ul({}, [
          li()
        ])
      });

      result.should.equal("<ul><li></li></ul>");
    end

    it "should take code as a string"
      var result = JM.render({}, "ul();")
      result.should.equal("<ul></ul>");
    end
  end
end
