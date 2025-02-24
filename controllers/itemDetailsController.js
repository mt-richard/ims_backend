const itemDetailsService = require('../services/item_details.service');

exports.getItemDetails = async (req, res) => {
  try {
    const { assetId } = req.params;
    const itemDetails = await itemDetailsService.getItemDetails(assetId);
    res.status(200).json(itemDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};