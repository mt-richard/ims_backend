const ItemMasterService = require('../services/item_master.service');

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

  exports.deleteSupplier = async (req, res) => {
    try {
      const id = req.params.id;
      const supData = await ItemMasterService.deleteSupplier(id);
      res.status(200).json(supData);
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

  exports.restoreSupplier = async (req, res) => {
    try {
      const id = req.params.id;
      const supData = await ItemMasterService.restoreSupplier(id);
      res.status(200).json(supData);
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

  exports.editSupplier = async (req, res) => {
    try {
      const id = req.params.id;
      const { sup_name, contact, status } = req.body
      const supData = await ItemMasterService.editSupplier(id, sup_name, contact, status);
      res.status(200).json(supData);
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