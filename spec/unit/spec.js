describe JM
  describe JM.Builder
    it 'should self-close a tag'
      JM.Builder.ul().should.equal("<ul></ul>");
    end

    it "should use an argument given"
      JM.Builder.ul({foo: "bar"}).should.equal("<ul foo='bar'></ul>")
    end

    it "should use the correct argument"
      JM.Builder.ul({bar: "quxx"}).should.equal("<ul bar='quxx'></ul>")
    end

    it "should use multiple arguments"
      JM.Builder.ul({foo: "bar", baz: "quxx"}).should.equal("<ul foo='bar' baz='quxx'></ul>");
    end

    it "should self-close a li"
      JM.Builder.li().should.equal("<li></li>");
    end

    it "should be able to nest"
      var result = JM.Builder.ul({"foo": "bar"}, [
        JM.Builder.li()
      ]);

      result.should.equal("<ul foo='bar'><li></li></ul>");
    end

    it "should be able to nest multiple elements"
      var result = JM.Builder.ul({"foo": "bar"}, [
        JM.Builder.li(),
        JM.Builder.li()
      ]);

      result.should.equal("<ul foo='bar'><li></li><li></li></ul>");
    end

    it "should be able to nest multiple elements when they are different"
      var result = JM.Builder.ul({"foo": "bar"}, [
        JM.Builder.li({foo: "bar"}),
        JM.Builder.li()
      ]);

      result.should.equal("<ul foo='bar'><li foo='bar'></li><li></li></ul>");
    end

    // pending:
    // it "should handle self-closing tags"
    //   var result = JM.Builder.img({src: "/images/foo.jpg"});
    //   result.should.equal("<img src='/images/foo.jpg' />");
    // end
  end
end