const PatientRegistry = artifacts.require("PatientRegistry");
const chai = require("chai");
const expect = chai.expect;

contract("PatientRegistry", (accounts) => {
  let patientRegistry;
  const owner = accounts[0];
  const requestor = accounts[1];
  const sharedWith = accounts[2];
  const patientId = "patient1";
  const historyEntry = "Patient created on 2023-08-19T00:54:18.266Z";
  const files = ["file1", "file2"];

  beforeEach(async () => {
    patientRegistry = await PatientRegistry.new();
  });

  it("should create a patient correctly", async () => {
    await patientRegistry.createPatient(patientId, historyEntry, {
      from: owner,
    });

    const patient = await patientRegistry.patients(patientId);
    expect(patient.patient_id).to.equal(patientId);
    expect(patient.owner).to.equal(owner);
    expect(Number(patient.createdDate)).to.be.greaterThan(0);

    const history = await patientRegistry.getPatientHistory(patientId);
    expect(history[0]).to.equal(historyEntry);
  });

  it("should emit the PatientCreated event", async () => {
    const tx = await patientRegistry.createPatient(patientId, historyEntry, {
      from: owner,
    });

    expect(tx.logs.length).to.equal(1);
    const log = tx.logs[0];
    expect(log.event).to.equal("PatientCreated");
    expect(log.args.patient_id).to.equal(patientId);
    expect(log.args.owner).to.equal(owner);
  });

  it("should fail when creating a patient with an existing ID", async () => {
    await patientRegistry.createPatient(patientId, historyEntry, {
      from: owner,
    });

    try {
      await patientRegistry.createPatient(patientId, historyEntry, {
        from: owner,
      });
      assert.fail("Expected error not received");
    } catch (error) {
      expect(error.reason).to.equal("Patient ID already exists!");
    }
  });

  it("should emit the AccessRequestAccepted event when accepting an access request", async () => {
    await patientRegistry.createPatient(patientId, historyEntry, {
      from: owner,
    });
    const tx = await patientRegistry.acceptAccessRequest(
      patientId,
      requestor,
      files,
      { from: owner }
    );

    expect(tx.logs.length).to.equal(1);
    const log = tx.logs[0];
    expect(log.event).to.equal("AccessRequestAccepted");
    expect(log.args.patient_id).to.equal(patientId);
    expect(log.args.requestor).to.equal(requestor);
  });

  it("should fail when a non-owner tries to accept an access request", async () => {
    await patientRegistry.createPatient(patientId, historyEntry, {
      from: owner,
    });

    try {
      await patientRegistry.acceptAccessRequest(patientId, requestor, files, {
        from: requestor,
      });
      assert.fail("Expected error not received");
    } catch (error) {
      expect(error.reason).to.equal(
        "Only the owner can accept access requests"
      );
    }
  });

  it("should emit the PatientUnshared event when unsharing a patient", async () => {
    await patientRegistry.createPatient(patientId, historyEntry, {
      from: owner,
    });
    const tx = await patientRegistry.unsharePatient(patientId, sharedWith, {
      from: owner,
    });

    expect(tx.logs.length).to.equal(1);
    const log = tx.logs[0];
    expect(log.event).to.equal("PatientUnshared");
    expect(log.args.patient_id).to.equal(patientId);
    expect(log.args.sharedWith).to.equal(sharedWith);
  });

  it("should fail when a non-owner tries to unshare a patient", async () => {
    await patientRegistry.createPatient(patientId, historyEntry, {
      from: owner,
    });

    try {
      await patientRegistry.unsharePatient(patientId, sharedWith, {
        from: requestor,
      });
      assert.fail("Expected error not received");
    } catch (error) {
      expect(error.reason).to.equal("Only the owner can unshare the patient");
    }
  });

  it("should emit the AccessRequested event when requesting access", async () => {
    await patientRegistry.createPatient(patientId, historyEntry, {
      from: owner,
    });
    const tx = await patientRegistry.requestAccess(patientId, requestor, {
      from: requestor,
    });

    expect(tx.logs.length).to.equal(1);
    const log = tx.logs[0];
    expect(log.event).to.equal("AccessRequested");
    expect(log.args.patient_id).to.equal(patientId);
    expect(log.args.requestor).to.equal(requestor);
  });

  it("should update the patient history when requesting access", async () => {
    await patientRegistry.createPatient(
      "patient1",
      "Patient created on 2023-08-19T00:54:18.266Z",
      { from: accounts[0] }
    );
    await patientRegistry.requestAccess("patient1", accounts[1], {
      from: accounts[1],
    });
    const history = await patientRegistry.getPatientHistory("patient1");
    assert.include(
      history[1],
      accounts[1].toLowerCase(),
      "History entry should include the requestor address"
    );
  });

  it("should fail when requesting access to a non-existent patient", async () => {
    try {
      await patientRegistry.requestAccess("nonexistent", requestor, {
        from: requestor,
      });
      assert.fail("Expected error not received");
    } catch (error) {
      expect(error.reason).to.equal("Patient does not exist!");
    }
  });

  it("should emit the AccessRequestCanceled event when canceling an access request", async () => {
    await patientRegistry.createPatient(patientId, historyEntry, {
      from: owner,
    });
    await patientRegistry.requestAccess(patientId, requestor, {
      from: requestor,
    });
    const tx = await patientRegistry.cancelAccessRequest(patientId, requestor, {
      from: requestor,
    });

    expect(tx.logs.length).to.equal(1);
    const log = tx.logs[0];
    expect(log.event).to.equal("AccessRequestCanceled");
    expect(log.args.patient_id).to.equal(patientId);
    expect(log.args.requestor).to.equal(requestor);
  });

  it("should update the patient history when canceling an access request", async () => {
    await patientRegistry.createPatient(patientId, historyEntry, {
      from: owner,
    });
    await patientRegistry.requestAccess(patientId, requestor, {
      from: requestor,
    });
    await patientRegistry.cancelAccessRequest(patientId, requestor, {
      from: requestor,
    });
    const history = await patientRegistry.getPatientHistory(patientId);
    assert.include(
      history[2],
      requestor.toLowerCase(),
      "History entry should include the requestor address"
    );
    assert.include(
      history[2],
      "cancelled",
      "History entry should include the word 'cancelled'"
    );
  });

  it("should fail when a non-owner and non-requestor tries to cancel the access request", async () => {
    await patientRegistry.createPatient(patientId, historyEntry, {
      from: owner,
    });
    await patientRegistry.requestAccess(patientId, requestor, {
      from: requestor,
    });

    try {
      await patientRegistry.cancelAccessRequest(patientId, requestor, {
        from: sharedWith,
      });
      assert.fail("Expected error not received");
    } catch (error) {
      expect(error.reason).to.equal(
        "Only the owner or requestor can cancel the access request"
      );
    }
  });

  it("should fail when canceling an access request for a non-existent patient", async () => {
    try {
      await patientRegistry.cancelAccessRequest("nonexistent", requestor, {
        from: requestor,
      });
      assert.fail("Expected error not received");
    } catch (error) {
      expect(error.reason).to.equal("Patient does not exist!");
    }
  });
});

it("only owner can accept access requests", async () => {
  try {
    await patientRegistry.acceptAccessRequest(patientId, requestor, [], { from: requestor });
  } catch (e) {
    assert(e.message.includes("Only the owner can accept access requests"));
    return;
  }
  assert(false);
});

it("only owner can unshare the patient", async () => {
  try {
    await patientRegistry.unsharePatient(patientId, requestor, { from: requestor });
  } catch (e) {
    assert(e.message.includes("Only the owner can unshare the patient"));
    return;
  }
  assert(false);
});

it("only owner or requestor can cancel the access request", async () => {
  await patientRegistry.requestAccess(patientId, { from: requestor });
  try {
    await patientRegistry.cancelAccessRequest(patientId, requestor, { from: accounts[2] });
  } catch (e) {
    assert(e.message.includes("Only the owner or requestor can cancel the access request"));
    return;
  }
  assert(false);
});