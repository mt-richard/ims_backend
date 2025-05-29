const UserService = require("../services/users.service");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res) => {
  try {
    const response = await UserService.getAllUsers();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, division, status } = req.body;

    const ifExists = await UserService.getUserByEmailOrUsername(
      email,
      username
    );

    if (!ifExists) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const response = await UserService.createUser({
        username,
        email,
        password: hashedPassword,
        role,
        division,
        status,
      });
      res.json(response);
    } else {
      res.status(200).json({ message: "User already exists" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserByID = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await UserService.getUserById(id);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const UserData = await UserService.deleteUser(id);
    res.status(200).json(UserData);
    // res.status(200).json({message: 'Content Deleted successfully'});
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

exports.restoreUser = async (req, res) => {
  try {
    const id = req.params.id;
    const UserData = await UserService.restoreUser(id);
    res.status(200).json(UserData);
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

exports.editUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, role,division, status } = req.body;
    const UserData = await UserService.editUser(
      id,
      username,
      email,
      role,
      division,
      status
    );
    res.status(200).json(UserData);
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

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginData = await UserService.login(email, password);
    res.status(200).json(loginData);
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

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const sendOtp = await UserService.sendOTP(email);
    res.status(200).json(sendOtp);
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

exports.validateOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const validateOtp = await UserService.validateOTP(email, otp);
    res.status(200).json(validateOtp);
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

exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reset = await UserService.resetPassword(email, password)
    res.status(200).json(reset);
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
