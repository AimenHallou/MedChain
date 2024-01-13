// src/utils/initHelia.js
let heliaInstance;
let createHelia;

const loadHelia = async () => {
  try {
    const heliaModule = await import('helia');
    createHelia = heliaModule.createHelia;
  } catch (err) {
    console.error('Failed to import Helia:', err);
    throw err;
  }
};

const initializeHelia = async () => {
  if (!heliaInstance) {
    await loadHelia();
    try {
      heliaInstance = await createHelia();
      console.log('Helia instance created');
    } catch (error) {
      console.error('Error creating Helia instance:', error);
      throw error;
    }
  }
  return heliaInstance;
};

exports.initializeHelia = initializeHelia;
exports.getHeliaInstance = () => heliaInstance;
