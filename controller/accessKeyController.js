const AccessKey = require('../model/acessKeyModel'); // Assuming you have a model for Access Keys
const { v4: uuidv4 } = require('uuid'); // For generating unique keys

// Get all access keys
exports.getAccessKeys = async (req, res) => {
  try {
    const keys = await AccessKey.find(); 
    res.status(200).json(keys);
  } catch (error) {
    console.error("Error fetching access keys:", error);
    res.status(500).json({ error: 'Failed to fetch access keys' });
  }
};

// Generate a new access key
exports.generateAccessKey = async (req, res) => {
  try {
    const { name } = req.body; // Get the key name from the request body
    if (!name.trim()) {
      return res.status(400).json({ error: "Key name is required" });
    }

    const newKey = new AccessKey({
      name: name, 
      key: uuidv4(), // Generate a new UUID
    });

    await newKey.save();
    res.status(201).json(newKey); // Return the newly created key 
  } catch (error) {
    console.error('Error generating access key:', error);
    res.status(500).json({ error: 'Failed to generate access key' });
  }
};

// Revoke an access key
exports.revokeAccessKey = async (req, res) => {
  try {
    const keyId = req.params.keyId;
    const deletedKey = await AccessKey.findByIdAndDelete(keyId); 

    if (!deletedKey) {
      return res.status(404).json({ error: 'Access key not found' });
    }

    res.status(204).send(); 
  } catch (error) {
    console.error('Error revoking access key:', error);
    res.status(500).json({ error: 'Failed to revoke access key' });
  }
};