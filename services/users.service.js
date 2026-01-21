const { users, otps, division_detail } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "5ecr3tAbG";


exports.getAllUsers = async () => {
  try {
    const items = await users.findAll({
      include: [
        {
          model: division_detail,
          as: 'division_belong', 
          attributes: ['division_name'], 
        },
      ],
    });

    // Transform the items to the desired format
    return items.map(item => {
      return {
        user_id: item.user_id,
        username: item.username,
        email: item.email,
        role: item.role,
        division: item.division,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by,
        division_name: item.division_belong ? item.division_belong.division_name : null, 
      };
    });
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  } 
};

// exports.getAllUsers = async () => {
//   try {
//     return await users.findAll();
//   } catch (error) {d
//     throw new Error(`Error fetching users: ${error.message}`);
//   }
// };

exports.getUserByEmailOrUsername = async (email, username) => {
  try {
    return await users.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: username }],
      },
    });
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

exports.getUserById = async (id) => {
  try {
    return await users.findOne({ where: { user_id: id } });
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

exports.createUser = async (userData) => {
  try {
    const response = await users.create(userData);
    return {
      message: "User added successful",
      user: response,
    };
  } catch (error) {
    throw new Error(`Error cretaing user: ${error.message}`);
  }
};

exports.createOtp = async (otpData) => {
  try {
    return await otps.create(otpData);
  } catch (error) {
    throw new Error(`Error cretaing user: ${error.message}`);
  }
};

exports.deleteUser = async (id) => {
  try {
    let response = await users.findByPk(id);
    if (!response) {
      const error = new Error(`user not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    response.status = "inactive";
    await response.save();
    return response;
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

exports.restoreUser = async (id) => {
  try {
    let response = await users.findByPk(id);
    if (!response) {
      const error = new Error(`User not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    response.status = "active";
    await response.save();
    return response;
  } catch (error) {
    throw new Error(`Error restoring users: ${error.message}`);
  }
};


exports.editUser = async (user_id, username, email, role, division, status) => {
  try {
    let userData = await users.findByPk(user_id);

    if (!userData) {
      const error = new Error(`user not found with id: ${user_id}`);
      error.statusCode = 404;
      throw error;
    }

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      // typeof password !== "string" ||
      typeof role !== "string" ||
      typeof division !== "string" ||
      typeof status !== "string"
    ) {
      throw new Error("Invalid input: All fields must be strings.");
    }
    userData.username = username;
    userData.email = email;

    // if (password) {
    //   const saltRounds = 10;
    //   userData.password = await bcrypt.hash(password, saltRounds);
    // }

    userData.role = role;
    userData.division = division;
    userData.status = status;

    await userData.save();
    return {
      message: 'User Details updated successful',
      user: userData
    };
  } catch (error) {
    throw new Error(`Error updating User: ${error.message}`);
  }
};

exports.login = async (email, password) => {
  try {
    if (!email || !password || password.length < 5) {
      throw new Error(
        "All fields are required and password must be at least 5 characters long"
      );
    }

    let user = await users.findOne({
      where: {
        [Op.and]: [{ email: email }, { status: "active" }],
      },
    });

    if (!user) {
      throw new Error("Login failed: User not found or inactive");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Login failed: Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.user_id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      message: "Login successful",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: token,
    };
  } catch (error) {
    throw new Error(`Error during login: ${error.message}`);
  }
};

exports.getUserByEmail = async (data) => {
  try {
    return await users.findOne({ where: { email: data } });
  } catch (error) {
    throw new Error(`user not found: ${error.message}`);
  }
};

const generateOTP = () => {
  return crypto.randomInt(10000000, 99999999).toString();
};

exports.sendOTP = async (email) => {
  try {
    const verifyEmail = await exports.getUserByEmail(email);
    if (!verifyEmail) {
      throw new Error("User not found");
    }

    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 1);

    // Store the OTP and its expiry in the OTP table, linked to the user’s email
    await exports.createOtp({
      email: email,
      otp_value: otp,
      expiry: otpExpiry,
    });

    await sendOTPEmail(email, otp);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    throw new Error(`Error sending OTP: ${error.message}`);
  }
};

const sendOTPEmail = async (email, otp) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "richardtuyishime43@gmail.com",
        pass: "Gmail.com250",
      },
      logger: true,
      debug: true,
    });

    let mailOptions = {
      from: "richardtuyishime43@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
      html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};

exports.validateOTP = async (email, inputOTP) => {
  try {
    const otpRecord = await otps.findOne({ where: { email } });
    if (!otpRecord) {
      throw new Error("OTP not found for this email");
    }

    const { otp_value, expiry } = otpRecord;

    if (otp_value !== inputOTP) {
      throw new Error("Invalid OTP");
    }

    if (new Date() > expiry) {
      throw new Error("OTP has expired");
    }

    await otps.destroy({ where: { email } });
    return { success: true, message: "OTP validated successfully" };
  } catch (error) {
    throw new Error(`Error validating OTP: ${error.message}`);
  }
};

const removeExpiredOTPs = async () => {
  try {
    await otps.destroy({ where: { expiry: { [Op.lt]: new Date() } } });
    console.log("Expired OTPs cleaned up.");
  } catch (error) {
    console.error("Error cleaning up expired OTPs:", error.message);
  }
};

setInterval(removeExpiredOTPs, 60 * 60 * 1000);

exports.resetPassword = async (email, password) => {
  try {
    let response = await exports.getUserByEmail(email);
    if (!response) {
      const error = new Error(`user not found with email: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    // response.password = password;
    if (password) {
      const saltRounds = 10;
      response.password = await bcrypt.hash(password, saltRounds);
    }
    await response.save();
    return {
      message: "Password Changed successfully",
      user: response,
    };
  } catch (error) {
    throw new Error(`Error validating OTP: ${error.message}`);
  }
};
