const ItemTransactionService = require("../services/item_transfer.service");

exports.getTransaction = async (req, res) => {
  try {
    const transactions = await ItemTransactionService.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTransactions = async (req, res) => {
  try {
    const data = req.body; // Get request data
    const result = await ItemTransactionService.createTransaction(data);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.transaction
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error creating transaction: ${error.message}`
    });
  }
};
