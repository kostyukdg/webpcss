/*global describe, it, xit*/
"use strict";

var fs = require("fs"),
    should = require("should"),
    postcss = require("postcss"),
    webpcss = require("../"),
    base64stub = require("./fixtures/base64");

describe("webpcss", function(){


  it("not modify sample", function(){
    var input = ".test { backround: red; }";
    input.should.be.equal(
      webpcss.transform(input)
    );
  });
  it("html tag", function(){
    var input = "html.test { background: url('test.png'); }";
    (input + "\nhtml.webp.test { background-image: url(test.webp); }").should.be.eql(
      webpcss.transform(input)
    );
  });
  it("border-radius css property", function(){
    var input = ".test { border-image: url('test.png'); }";
    (input + "\n.webp .test { border-image: url(test.webp); }").should.be.eql(
      webpcss.transform(input)
    );
  });
  it(".html classname", function(){
    var input = ".html.test { background: url('test.png'); }";
    (input + "\n.webp .html.test { background-image: url(test.webp); }").should.be.eql(
      webpcss.transform(input)
    );
  });

  it("multiple selectors", function(){
    var input = ".test1, .test2 { background: url('test.png'); }";
    (input + "\n.webp .test1, .webp .test2 { background-image: url(test.webp); }").should.be.equal(
      webpcss.transform(input)
    );
  });

  it("default options background-image with url", function(){
    var input = ".test { background-image: url(test.jpg); }";
    (input + "\n.webp .test { background-image: url(test.webp); }").should.be.equal(
      webpcss.transform(input)
    );
  });

  it("default options background with url", function(){
    var input = ".test { background: url(test.jpeg); }";
    (input + "\n.webp .test { background-image: url(test.webp); }").should.be.equal(
      webpcss.transform(input)
    );
  });

  it("default options background with url and params", function(){
    var input = ".test { background: transparent url(test.png) no-repeat; }";
    (input + "\n.webp .test { background-image: url(test.webp); }").should.be.equal(
      webpcss.transform(input)
    );
  });

  it("default options background multiple urls", function(){
    var input = ".img_play_photo_multiple{ background: url(number.png) 600px 10px no-repeat,\nurl(\"thingy.png\") 10px 10px no-repeat,\nurl('Paper-4.png');\n}";
    var output = input + "\n.webp .img_play_photo_multiple{ background-image: url(number.webp),url(thingy.webp),url(Paper-4.webp);\n}";
    output.should.be.equal(
      webpcss.transform(input)
    );
  });

  it("default options multiple mixed clasess", function(){
    var input = ".test1{ background: url(\"test1.jpeg\");}" +
        ".test2{ background-image: url(\'test2.png\');}";
    var output = input + ".webp .test1{ background-image: url(test1.webp);}" +
      ".webp .test2{ background-image: url(test2.webp);}";
    output.should.be.equal(
      webpcss.transform(input)
    );
  });
  it("default options background with gif", function(){
    var input = ".test { background: url(test.gif); }";
    input.should.be.equal(
      webpcss.transform(input)
    );

    input = ".test { background: url(test.gif), url(\"test1.jpg\"); }";
    (input + "\n.webp .test { background-image: url(test.gif),url(test1.webp); }").should.be.equal(
      webpcss.transform(input)
    );

  });
  it("default options background data uri", function(){
    var input = ".test { background: url(" + base64stub.png + ") no-repeat; }";
    input.should.be.equal(
      webpcss.transform(input)
    );
  });
  it("custom options baseClass", function(){
    var input = ".test { background-image: url(test.png); }";
    (input + "\n.webp1 .test { background-image: url(test.webp); }").should.be.equal(
      webpcss.transform(input, {baseClass: ".webp1"})
    );
  });
  it("custom options replace_from background with gif", function(){
    var input = ".test { background: url(test.gif); }";
    (input + "\n.webp .test { background-image: url(test.webp); }").should.be.equal(
      webpcss.transform(input, {replace_from: /\.gif/g})
    );
  });
  it("custom options replace_to background-image with url", function(){
    var input = ".test { background-image: url(test.jpg); }";
    (input + "\n.webp .test { background-image: url(test.other); }").should.be.equal(
      webpcss.transform(input, {replace_to: ".other"})
    );
  });
  it("check with @media-query", function(){
    var input = "@media all and (min-width:100px){ .test { background-image: url(test.jpg); } }";
    var output = input + " @media all and (min-width:100px){ .webp .test{ background-image: url(test.webp); } }";
    output.should.be.eql(webpcss.transform(input));
  });
  it("check with multiple @media-query", function(){
    var input = "@media all and (max-width:200px){ @media all and (min-width:100px){ .test { background-image: url(test.jpg); } } }";
    var output = input + " @media all and (max-width:200px){ @media all and (min-width:100px){ .webp .test{ background-image: url(test.webp); } } }";
    output.should.be.eql(webpcss.transform(input));
  });
  it("check with multiple @media-query with other rule and decls", function(){
    var input = "@media all and (max-width:200px){" +
                " .garbage{ color: blue; } " +
                "@media all and (min-width:100px){" +
                " .test { " +
                "background-image: url(test.jpg); color: red; " +
                "} } }";
    var output = input + " @media all and (max-width:200px){ @media all and (min-width:100px){ .webp .test{ background-image: url(test.webp); } } }";
    output.should.be.eql(webpcss.transform(input));
  });
  //xit("check postcss processor api", function(){
  //  var input = ".test { background-image: url(test.jpg); }";
  //  (input + ".webp .test { background-image: url(test.webp); }").should.be.equal(
  //    postcss(webpcss.postcss).process(input).css
  //  );
  //});
  //xit("check convert base64 webp options background data uri", function(){
  //  var input = ".test { background: " + base64stub.png_css + " no-repeat; }";
  //  var res = webpcss.transform(input);
  //  res.should.include("data:image/png;base64,");
  //  res.should.include(".webp");
  //  res.should.include("data:image/webp;base64,");
  //});

});

