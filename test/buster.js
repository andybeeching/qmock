var config = module.exports;

config["QMock Tests"] = {
    rootPath: "../",
    environment: "browser", // or "node"
    sources: ["lib/qmock.js"],
    tests: ["test/*-test.js"]
}

// Add more configuration groups as needed
