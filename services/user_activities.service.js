
// const { users } = require('../models');
// const { Op } = require('sequelize');
// const user_activities = require('../models/user_activities');


// exports.getAllActivities = async () => {
//   try {
//     const user_activities = await user_activities.findAll({
//       include: [
//         {
//           model: users,
//           as: 'users', 
//           attributes: ['username'], 
//         },
//       ],
//     });

//     // Transform the user_activities to the desired format
//     return user_activities.map(item => {
//       return {
//         activity_id: item.activity_id,
//         activity: item.activity,
//         status: item.status,
//         created_at: item.created_at,
//         created_by: item.created_by,
//         username: item.users ? item.users.username : null, 
//       };
//     });
//   } catch (error) {
//     throw new Error(`Error fetching activities: ${error.message}`);
//   } 
// };


// exports.getActivitiesById = async (id) => {
//   try {
//     return await a.findOne({ where: { location_id: id } });
//   } catch (error) {
//     throw new Error(`Error fetching Location: ${error.message}`);
//   }
// };