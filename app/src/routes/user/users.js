'use strict';

const express = require('express');

const { modifyUser, changePassword, deleteUser } = require('../../controllers/user/users');
const { sendErrorResponse } = require('../../utils/errors');

const router = express.Router({ mergeParams: true });

router.patch('/self', async (req, res, next) => {
  try {
    const userUpdate = req.body;
    const { userId } = req.ctx;

    const updatedUser = await modifyUser(userId, userUpdate);

    res.status(200).json({
      data: updatedUser,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.put('/self/password', async (req, res, next) => {
  try {
    const changePasswordData = req.body;
    const { userId } = req.ctx;

    await changePassword(userId, changePasswordData);

    res.status(200).json({});
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

router.delete('/self', async (req, res, next) => {
  try {
    const { userId } = req.ctx;

    await deleteUser(userId);

    res.status(200).json({});
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

module.exports = router;
