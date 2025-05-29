const  DivisionDetailService = require('../services/division_detail.service');
// const {users} = require('../models');

exports.getDivisionDetails = async (req, res) => {
    try {
      const response = await DivisionDetailService.getAllDivisionDetail();
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.createDivisionDetail = async (req, res) => { 
    try {
        const { division_code, location_id, division_name, status } = req.body
        const ifExists = await DivisionDetailService.getByName(division_code)
        if (!ifExists) {
            const response = await DivisionDetailService.createDivisionDetail({ division_code, location_id, division_name, status})
            res.json(response);
        } else {
            res.status(200).json({message : "Division already exists"})
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getDivisionByID = async (req, res) => {
    try {
        const id = req.params.id;
        const response =  await DivisionDetailService.getDivisionById(id);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

  exports.deleteDivisionDetail = async (req, res) => {
    try {
      const id = req.params.id;
      const catData = await DivisionDetailService.deleteDivisionDetail(id);
      res.status(200).json(catData);
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

  exports.restoreDivisionDetail = async (req, res) => {
    try {
      const id = req.params.id;
      const catData = await DivisionDetailService.restoreDivisionDetail(id);
      res.status(200).json(catData);
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

  exports.editDivisionDetail = async (req, res) => {
    try {
      const id = req.params.id;
      const {division_name, division_code, location_id, status } = req.body
      const catData = await DivisionDetailService.editDivisionDetail(id, division_name, division_code, location_id, status);
      res.status(200).json(catData);
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