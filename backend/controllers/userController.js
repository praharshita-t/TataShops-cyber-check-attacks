import { findUserById, updateUserProfile } from '../models/userModel.js';

export const getProfile = (req, res) => {
  try {
    const user = findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
    });
  }
};

export const updateProfile = (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty.',
      });
    }

    const updatedUser = updateUserProfile(req.user.id, {
      name: name.trim(),
      phone: phone !== undefined ? phone.trim() : req.user.phone,
      address: address !== undefined ? address.trim() : req.user.address,
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
};
