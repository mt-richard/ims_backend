const  DivisionService = require('../services/division.service');
// const {users} = require('../models');

exports.getDivisions = async (req, res) => {
    try {
      const response = await DivisionService.getAllDivision();
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.createDivision = async (req, res) => { 
    try {
        const { division_code, location_id, division_name, status } = req.body
        const ifExists = await DivisionService.getByName(division_code)
        if (!ifExists) {
            const response = await DivisionService.createDivision({ division_code, location_id, division_name, status})
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
        const response =  await DivisionService.getDivisionById(id);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

  exports.deleteDivision = async (req, res) => {
    try {
      const id = req.params.id;
      const catData = await DivisionService.deleteDivision(id);
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

  exports.restoreDivision = async (req, res) => {
    try {
      const id = req.params.id;
      const catData = await DivisionService.restoreDivision(id);
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

  exports.editDivision = async (req, res) => {
    try {
      const id = req.params.id;
      const {division_name, division_code, location_id, status } = req.body
      const catData = await DivisionService.editDivision(id, division_name, division_code, location_id, status);
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