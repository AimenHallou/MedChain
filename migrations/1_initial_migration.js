// migrations/1_initial_migration.js
const PatientRegistry = artifacts.require("PatientRegistry");

module.exports = function (deployer) {
  deployer.deploy(PatientRegistry);
};
