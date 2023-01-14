const router = require("express").Router();
const { upload } = require("../../services/aws/aws");
const userController = require("../../controllers/user.controller")


/**
 * @swagger
 * /api/admin/addDeveloper/:userId:
 *   post:
 *     tags:
 *       - ADMIN_DEVELOPER_DASHBOARD
 *     description: Developer Added
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: first_name
 *         description: first_name
 *         in: formData
 *         required: true
 *       - name: last_name
 *         description: last_name
 *         in: formData
 *         required: true
 *       - name: mobile_number
 *         description: mobile_number
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Developer added successfully.
 *       404:
 *         description: Requested data not found.
 *       402:
 *         description: Invalid login credentials.
 *       500:
 *         description: Internal Server Error
 */
router.post('/addDeveloper/:userId',upload.array("profile_image"), userController.addDeveloper)


/**
 * @swagger
 * /api/admin/listDeveloper:
 *   get:
 *     tags:
 *       - ADMIN_DEVELOPER_DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Developer list successfully.
 *       404:
 *         description: Requested data not found.
 *       402:
 *         description: Invalid login credentials.
 *       500:
 *         description: Internal Server Error
 */
router.get('/listDeveloper', userController.listDeveloper)


/**
 * @swagger
 * /api/admin/viewDeveloper:
 *   get:
 *     tags:
 *       - ADMIN_DEVELOPER_DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: _id
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description: Developer view successfully.
 *       404:
 *         description: Requested data not found.
 *       402:
 *         description: Invalid login credentials.
 *       500:
 *         description: Internal Server Error
 */
router.get('/viewDeveloper', userController.viewDeveloper)






router.post("/loginDeveloper", loginDeveloper);

module.exports = router;



