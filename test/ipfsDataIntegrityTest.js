// src/tests/ipfsDataIntegrityTest.js
const saveFilesToIPFS = require("../src/utils/saveToIPFS");
const fetchFileFromIPFS = require("../src/utils/fetchAndDecryptFromIPFS");
const chai = require("chai");
const expect = chai.expect;

describe("IPFS Data Integrity Test", function () {
  it("should save and fetch file with data integrity", async function () {
    const fileToSave = {
      base64: "exampleBase64Data",
      name: "testFile",
      dataType: "text/plain",
    };

    const savedFiles = await saveFilesToIPFS([fileToSave]);
    const savedFile = savedFiles[0];

    const fetchedFileBase64 = await fetchFileFromIPFS(savedFile.ipfsCID);

    expect(fetchedFileBase64).to.equal(fileToSave.base64);
  });
});
