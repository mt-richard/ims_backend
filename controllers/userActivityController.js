// const  ActivitiesService = require('../services/user_activities.service');

// exports.getActivities = async (req, res) => {
//     try {
//       const response = await ActivitiesService.getAllActivities();
//       res.json(response);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

//   exports.getActivitiesById = async (req, res) => {
//     try {
      
//       const response = await ActivitiesService.getActivitiesById(id);
//       res.json(response);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
// exports.createActivity = async (req, res) => { 

//     try {
//         const { activity, status, created_by } = req.body
//             const response = await ActivitiesService.createactivity({ activity, status, created_by})
//             res.json(response);
       
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }


//   exports.deleteactivity = async (req, res) => {
//     try {
//       const id = req.params.id;
//       const supData = await ActivitiesService.deleteactivity(id);
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

