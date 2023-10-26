// migrations/1_initial_migration.js
const PatientRegistry = artifacts.require("PatientRegistry");
const DatasetRegistry = artifacts.require("DatasetRegistry");

module.exports = function (deployer) {
  deployer.deploy(PatientRegistry);
  deployer.deploy(DatasetRegistry);
};
