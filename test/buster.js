var config = module.exports;

config["Test Browser"] = {

  // Advanced config
  // extensions: [ require("buster-lint") ],
  // "buster-lint": {
  //     linter: "jshint",
  //     linterOptions: {
  //
  //       Formatting Conventions
  //       indent: 2,
  //       maxlen: 100,
  //       white: false,
  //       onevar: false,
  //
  //       Syntax Conventions
  //       browser: true,
  //       eqnull: true,
  //       immed: true,
  //       undef: true,
  //       strict: true,
  //       trailing: true
  //
  //       Code Conventions
  //       maxparams: 3,
  //       maxdepth: 3,
  //       maxstatements: 8,
  //       maxcomplexity: 7 // Cyclomatic Complexity Score
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
