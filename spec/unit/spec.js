describe "JM"
  describe "Builder"
    before_each
      builder = new JM.Builder;
    end

    it "should have a builder"
      (builder instanceof JM.Builder).should.equal(true);
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

    it "should store multiple calls"
      builder.ul();
      builder.ul();

      builder.toHTML().should.equal("<ul></ul><ul></ul>");
    end

    // pending:
    // it "should handle self-closing tags"
    //   var result = JM.Builder.img({src: "/images/foo.jpg"});
    //   result.should.equal("<img src='/images/foo.jpg' />");
    // end
  end
end
