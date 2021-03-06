"use strict";
/*
 * webpcss
 * https://github.com/lexich/webpcss
 *
 * Copyright (c) 2015 Efremov Alexey
 * Licensed under the MIT license.
 */
var urldata = require("urldata");
var CWebp = require("cwebp").CWebp;

var base64pattern = "data:";
var base64patternEnd = ";base64,";

class WebpBase64 {
  extract(value, isUrl) {
    var result = [];
    if (!!isUrl) {
      var data = urldata(value);
      for (var i = 0; i < data.length; i++) {
        if (!data[i]) { continue; }
        result[result.length] = WebpBase64.extractor(data[i], isUrl);
      }
    } else {
      var res = WebpBase64.extractor(value, isUrl);
      if (res) {
        result[result.length] = res;
      }
    }
    return result;
  }

  convert(data, fConfig) {
    var buffer = (data instanceof Buffer) ? data : new Buffer(data, "base64");
    var encoder = new CWebp(buffer);
    encoder = fConfig ? fConfig(encoder) : encoder;
    return encoder.toBuffer();
  }

  static extractor(value) {
    if (!value) { return; }
    var base64pos = value.indexOf(base64pattern);
    if (base64pos >= 0) {
      var base64posEnd = value.indexOf(base64patternEnd);
      if (base64posEnd < 0) { return {mimetype: "url", data: value}; }
      var mimetype = value.slice(base64pos + base64pattern.length, base64posEnd);
      var data = value.slice(base64posEnd + base64patternEnd.length);
      return {mimetype, data};
    } else {
      return {mimetype: "url", data: value};
    }
  }
}

export default WebpBase64;
