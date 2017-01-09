"use strict";

var Committee = function (options) {
  for (var fld in options) {
    if (options[fld]) {
      this[fld] = options[fld];
    }
  }
  this.hearings = [];
  this.meta = [];
  return this;
};


Committee.prototype.addHearing = function (options) {
  options.baseUrl = this.url;
  var hearing = new Hearing(options);
  for (var hear of this.hearings) {
    if (hear.date === options.date) {
      scraper.msg("likely dupe");
      return false;
    }
  }
  this.hearings.push(hearing);
  return hearing;
};




var Witness = function (options) {
  for (var fld in options) {
    if (options[fld]) {
      this[fld] = options[fld];
    }
  }
  if (!options.pdfs) {
    this.pdfs = [];
  }
};

var scraper = {};

scraper.msg = function (msg) {
  console.log(msg);
};


Witness.prototype.addPdf = function (hear, url) {
  for (var pdf of this.pdfs) {
    if (url === pdf.remoteUrl) {
      scraper.msg('blocking duplicate');
      return false;
    }
  }
  var thepdf = new Pdf({
    "hear": hear.shortdate,
    "url": url
  });
  this.pdfs.push(thepdf);
};

var Hearing = function (options) {
  this.video = {};
  this.witnesses = [];

  for (var fld in options) {
    if (options[fld]) {
      this[fld] = options[fld];
    }
  }
  if (!this.shortdate) {
    this.shortdate = moment(new Date(this.date)).format("YYMMDD");
  }
};

Hearing.prototype.addVideo = function (video) {
  video.basename = this.shortdate;
  this.video = new Video(JSON.parse(JSON.stringify(video)));
};

Hearing.prototype.addWitness = function (witness) {
  scraper.msg("adding " + witness.lastName);
  if (!witness.isPrototypeOf(Witness)) {
    var wit = new Witness(witness);
    this.witnesses.push(wit);
    return wit;
  } else {

    this.witnesses.push(witness);
    return witness;
  }

};
