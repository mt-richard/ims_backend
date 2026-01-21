const { item_master, license_master } = require('../models');
const { Op } = require('sequelize'); // Import Op for Sequelize operators

exports.getAssetInUse = async () => {
  const assetsInUse = await item_master.findAll({ where: { item_status: 'in-use' } });
  return {
    count: assetsInUse.length,
    details: assetsInUse,
  };
};

exports.getAssetInstock = async () => {
  const assetsInStock = await item_master.findAll({ where: { item_status: 'in_stock' } });
  return {
    count: assetsInStock.length,
    details: assetsInStock,
  };
};

exports.getAssetDamaged = async () => {
  const assetsDamaged = await item_master.findAll({ where: { item_status: 'damaged' } });
  return {
    count: assetsDamaged.length,
    details: assetsDamaged,
  };
};

exports.getAssetScrapped = async () => {
  const assetsScrapped = await item_master.findAll({ where: { item_status: 'scrapped' } });
  return {
    count: assetsScrapped.length,
    details: assetsScrapped,
  };
};

exports.getAssetLost = async () => {
  const assetsLost = await item_master.findAll({ where: { item_status: 'lost' } });
  return {
    count: assetsLost.length,
    details: assetsLost,
  };
};

exports.getLicenceDeatils = async () => {
  const activeLicenses = await item_master.findAll({
    where: {
      item_type: 'license',
      license_start_time: { [Op.lte]: new Date() },
      license_expire_time: { [Op.gt]: new Date() },
    },
  });

  const expiredLicenses = await item_master.findAll({
    where: {
      item_type: 'license',
      license_expire_time: { [Op.lte]: new Date() },
    },
  });

  return {
    totalActive: activeLicenses.length,
    totalExpired: expiredLicenses.length,
    activeLicenses,
    expiredLicenses,
  };
};