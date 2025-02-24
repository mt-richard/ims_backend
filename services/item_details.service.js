const { item_master, sub_categories, locations, suppliers, sequelize } = require('../models');

exports.getItemDetails = async (assetId) => {
  try {
    const item = await item_master.findOne({
      where: { asset_id: assetId },
      include: [
        {
          model: sub_categories,
          as: 'category',
          attributes: ['description'],
        },
        {
          model: suppliers,
          as: 'supplier',
          attributes: ['sup_name'],
        },
        {
          model: locations,
          as: 'location_use',
          attributes: ['location_name'],
        },
      ],
    });

    if (!item) {
      throw new Error('Item not found.');
    }

    // Transform the item to the desired format
    const itemDetails = {
      item_id: item.item_id,
      item_category: item.item_category,
      item_name: item.item_name,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      supplier_id: item.supplier_id,
      location: item.location,
      asset_id: item.asset_id,
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at,
      created_by: item.created_by,
      updated_by: item.updated_by,
      category_name: item.category ? item.category.description : null,
      sup_name: item.supplier ? item.supplier.sup_name : null,
      location_name: item.location_use ? item.location_use.location_name : null,
      item_type: item.item_type,
    };

    // Parse the location JSON field and include location details
    const locationDetails = await Promise.all(
      JSON.parse(item.location).map(async (loc) => {
        const locationDetail = await locations.findOne({
          where: { location_id: loc.location_id },
          attributes: ['location_name'],
        });
        return {
          ...loc,
          location_name: locationDetail ? locationDetail.location_name : null,
        };
      })
    );

    itemDetails.location = locationDetails;

    return itemDetails;
  } catch (error) {
    throw new Error(`Error fetching item details: ${error.message}`);
  }
};