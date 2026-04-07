const express = require('express');
const router = express.Router();
const OrganModel = require('./models');

router.get('/:organ', (req, res) => {
    const organName = req.params.organ;
    console.log(`[Backend] Fetching data for: ${organName}`);
    
    const data = OrganModel.getOrganData(organName);
    
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: "Organ not found" });
    }
});

module.exports = router;
