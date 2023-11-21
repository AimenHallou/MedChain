// migrations/1_initial_migration.js
const fs = require('fs');
const path = require('path');
const PatientRegistry = artifacts.require("PatientRegistry");
const DatasetRegistry = artifacts.require("DatasetRegistry");

module.exports = function (deployer) {
  deployer.deploy(PatientRegistry).then(() => {
    const configPath = path.join(__dirname, '..', 'config', 'development.js');
    fs.readFile(configPath, 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(/patientRegistryContract: ".*"/, `patientRegistryContract: "${PatientRegistry.address}"`);

      fs.writeFile(configPath, result, 'utf8', function (err) {
         if (err) return console.log(err);
      });
    });
  });

  deployer.deploy(DatasetRegistry);
};
