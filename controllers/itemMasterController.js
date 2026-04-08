const ItemMasterService = require('../services/item_master.service.js');

exports.getItemsInStock = async (req, res) => {
  try {
    const items = await ItemMasterService.getItemsInStockByDiv(req.user.id); 
    res.json(items); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createStockItems = async (req, res) => { 
    try {
        const { item_name, item_category, description, quantity, unit, supplier_id, sub_category_id, location, division, item_type, item_status, license_start_time, license_expire_time ,status } = req.body
        const ifExists = await ItemMasterService.getByName(item_name)
        if (!ifExists) {
            const response = await ItemMasterService.createItems({ item_name, item_category, description, quantity, unit, supplier_id, sub_category_id, location, division, item_type, item_status, license_start_time, license_expire_time, status})
            res.json(response);
        } else {
          res.status(409).json({ message: "Item already exists" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getItemById = async (req, res) => {
    try {
        const id = req.params.id;
        const response =  await ItemMasterService.getSupplierById(id);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

  exports.deleteItem = async (req, res) => {
    try {
      const id = req.params.id;
      const itemData = await ItemMasterService.deleteItem(id);
      res.status(200).json(itemData);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          error: error.message,
          
        });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  };

  exports.restoreItem = async (req, res) => {
    try {
      const id = req.params.id;
      const itemData = await ItemMasterService.restoreItem(id);
      res.status(200).json(itemData);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          error: error.message,
          
        });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  };


exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.id; // matches route /item_master/edit/:id
    const payload = req.body;

    const result = await ItemMasterService.updateItem(itemId, payload);

    return res.status(200).json(result);

  } catch (error) {
    if (error.message.includes("Item not found")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes("No valid fields")) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update item",
    });
  }
};
