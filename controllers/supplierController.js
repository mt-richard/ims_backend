const  SupplierService = require('../services/suppliers.service');

exports.getSuppliers = async (req, res) => {
    try {
      const response = await SupplierService.getAllSuppliers();
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.createSupplier = async (req, res) => { 
    try {
        const { sup_name, contact, address, sup_type, currency, division, status } = req.body
        const ifExists = await SupplierService.getByName(sup_name)
        if (!ifExists) {
            const response = await SupplierService.createSupplier({ sup_name,contact, address, sup_type, currency,  division, status})
            res.json(response);
        } else {
            res.status(200).json({message : "Supplier already exists"})
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getSupplierById = async (req, res) => {
    try {
        const id = req.params.id;
        const response =  await SupplierService.getSupplierById(id);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

  exports.deleteSupplier = async (req, res) => {
    try {
      const id = req.params.id;
      const supData = await SupplierService.deleteSupplier(id);
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
      const supData = await SupplierService.restoreSupplier(id);
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
      const { sup_name, contact, address, sup_type, currency, division, status } = req.body
      const supData = await SupplierService.editSupplier(id, sup_name, contact, address, sup_type, currency, division, status);
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