// models/Patient.js
import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  patient_id: { type: String, required: true },
  owner: { type: String, required: true },
  createdDate: { type: Date, required: true },
  content: [{ type: mongoose.Schema.Types.Mixed }],
  sharedWith: { type: Map, of: String },
  history: [{ type: mongoose.Schema.Types.Mixed }], 
  accessRequests: [String]
});

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

export default Patient;
