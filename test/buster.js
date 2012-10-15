var config = module.exports;

config["Test Browser"] = {

  // Advanced config
  // extensions: [ require("buster-lint") ],
  // "buster-lint": {
  //     linter: "jshint",
  //     linterOptions: {
  //       indent: 2,
  //       maxlen: 100,
  //       white: false,
  //       onevar: false,
  //       browser: true,
  //       eqnull: true,
  //       immed: true,
  //       undef: true,
  //       strict: true,
  //       trailing: true
  //     }
  // },

  // Basic config
  rootPath: "../",
    environment: "browser",
    sources: ["src/qmock.js"],
    tests: ["test/*-test.js"]
};

// config["Test Node"] = {
//     rootPath: "../",
//     environment: "node",
//     sources: ["lib/sut.js"],
//     tests: ["test/*-test.js"]
// }
