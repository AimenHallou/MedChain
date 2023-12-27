// src/tests/ipfsDataIntegrityTest.js
const { saveFilesToIPFS } = require('../src/utils/saveToIPFS.js');
const { fetchAndDecryptFromIPFS } = require('../src/utils/fetchAndDecryptFromIPFS.ts');

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

    const fetchedFileBase64 = await fetchAndDecryptFromIPFS(savedFile.ipfsCID);

    expect(fetchedFileBase64).to.equal(fileToSave.base64);
  });
});
