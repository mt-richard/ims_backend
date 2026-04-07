const ItemSpecService = require('../services/item_specifications.service');

exports.getSpecsByItem = async (req, res) => {
  try {
    const item_id = req.params.item_id;
    const data = await ItemSpecService.getSpecsByItem(item_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSpecs = async (req, res) => {
  try {
    const { item_id, specs } = req.body;

    const data = await ItemSpecService.createItemSpecs(item_id, specs);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSpecs = async (req, res) => {
  try {
    const { item_id, specs } = req.body;

    const data = await ItemSpecService.updateItemSpecs(item_id, specs);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSpecs = async (req, res) => {
  try {
    const item_id = req.params.item_id;

    const data = await ItemSpecService.deleteSpecsByItem(item_id);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.restoreSpecs = async (req, res) => {
  try {
    const item_id = req.params.item_id;

    const data = await ItemSpecService.restoreSpecsByItem(item_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};