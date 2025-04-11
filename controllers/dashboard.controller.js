const dashboardService = require('../services/dashboard.service');

exports.getAssetInUse = async (req, res) => {
  try {
    const result = await dashboardService.getAssetInUse();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssetInstock = async (req, res) => {
  try {
    const result = await dashboardService.getAssetInstock();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssetscrapped = async (req, res) => {
  try {
    const result = await dashboardService.getAssetscrapped();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssetLost = async (req, res) => {
  try {
    const result = await dashboardService.getAssetLost();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLicenceDeatils = async (req, res) => {
  try {
    const result = await dashboardService.getLicenceDeatils();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
