const SpecificationService = require('../services/specification_fields.service');

exports.getAllFields = async (req, res) => {
  try {
    const data = await SpecificationService.getAllFields();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFieldsBySubCategory = async (req, res) => {
  try {
    const sub_category_id = req.params.sub_category_id;
    const data = await SpecificationService.getFieldsBySubCategory(sub_category_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createField = async (req, res) => {
  try {
    const { sub_category_id, field_name, field_type, is_required } = req.body;

    const data = await SpecificationService.createField({
      sub_category_id,
      field_name,
      field_type,
      is_required
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateField = async (req, res) => {
  try {
    const id = req.params.id;
    const { field_name, field_type, is_required } = req.body;

    const data = await SpecificationService.updateField(
      id,
      field_name,
      field_type,
      is_required
    );

    res.json(data);
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

exports.deleteField = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await SpecificationService.deleteField(id);
    res.json(data);
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

exports.restoreField = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await SpecificationService.restoreField(id);
    res.json(data);
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