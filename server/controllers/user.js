import User from './../models/User.js';

export const userPost = async (req, res) => {
  try {
    const { name, mobileNo, password, role } = req.body;

    const existingUser = await User.findOne({ mobileNo });

    if (existingUser) {
      return res.json({
        success: false,
        message: 'Mobile No already exists',
      });
    }

    const user = new User({
      name,
      mobileNo,
      password,
      role,
    });

    const savedUser = await user.save();

    res.json({
      success: true,
      message: 'User created successfully',
      data: savedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the user',
      error: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { mobileNo, password } = req.body;

    const user = await User.findOne({ mobileNo });

    if (!user || user.password !== password) {
      return res.json({
        success: false,
        message: 'Invalid mobile number or password',
      });
    }

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        mobileNo: user.mobileNo,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while logging in',
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching users',
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.query;

    const user = await User.findByIdAndDelete({ _id: userId });

    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the user',
      error: error.message,
    });
  }
};
