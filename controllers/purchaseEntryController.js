const PurchaseEntryService = require("../services/purchase_entry.service");

exports.getPurchaseEntries = async (req, res) => {
  try {
    const items = await PurchaseEntryService.getAllPurchases();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createPurchaseEntry = async (req, res) => {
  try {
    const data = req.body; // Get request data
    const result = await PurchaseEntryService.createPurchaseEntry(data);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.item
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error creating purchase entry: ${error.message}`
    });
  }
};


// exports.getMovementById = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const response =  await PurchaseEntryService.getSupplierById(id);
//         res.json(response);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

//   exports.deleteMovement = async (req, res) => {
//     try {
//       const id = req.params.id;
//       const supData = await PurchaseEntryService.deleteMovement(id);
//       res.status(200).json(supData);
//     } catch (error) {
//       if (error.statusCode) {
//         res.status(error.statusCode).json({
//           status: error.statusCode,
//           error: error.message,

//         });
//       } else {
//         res.status(500).json({ message: error.message });
//       }
//     }
//   };

//   exports.restoreMovement = async (req, res) => {
//     try {
//       const id = req.params.id;
//       const supData = await PurchaseEntryService.restoreMovement(id);
//       res.status(200).json(supData);
//     } catch (error) {
//       if (error.statusCode) {
//         res.status(error.statusCode).json({
//           status: error.statusCode,
//           error: error.message,

//         });
//       } else {
//         res.status(500).json({ message: error.message });
//       }
//     }
//   };

//   exports.editMovement = async (req, res) => {
//     try {
//       const id = req.params.id;
//       const { sup_name, contact, status } = req.body
//       const supData = await PurchaseEntryService.editMovement(id, sup_name, contact, status);
//       res.status(200).json(supData);
//     } catch (error) {
//       if (error.statusCode) {
//         res.status(error.statusCode).json({
//           status: error.statusCode,
//           error: error.message,

//         });
//       } else {
//         res.status(500).json({ message: error.message });
//       }
//     }
//   };
