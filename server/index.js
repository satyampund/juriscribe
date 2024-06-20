import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import { userPost, userLogin, getAllUsers, deleteUser } from './controllers/user.js';
import {
  templatePost,
  getTemplate,
  getAllTemplates,
  deleteTemplate,
} from './controllers/template.js';

dotenv.config();
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running healty',
  });
});

//user APIs
app.post('/api/v1/login', userLogin);
app.post('/api/v1/user', userPost);
app.get('/api/v1/users', getAllUsers);
app.delete('/api/v1/user', deleteUser);

//template APIs
app.post('/api/v1/template', templatePost);
app.get('/api/v1/template', getTemplate);
app.get('/api/v1/templates', getAllTemplates);
app.delete('/api/v1/template', deleteTemplate);

app.post('/verifyUser', async (req, res) => {
  const { token, claim_id } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Token is required',
    });
  }

  if (!claim_id) {
    return res.status(400).json({
      success: false,
      message: 'Claim ID is required',
    });
  }

  try {
    const response = await axios.post(`${process.env.CADRE_BASE_URL}/v1/editor/verify/auth_token`, {
      token,
      claim_id,
    });
    const userData = response.data;
    res.json({
      success: true,
      message: 'User verified successfully',
      user: userData,
    });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      return res.status(403).json({
        success: false,
        message: 'Invalid token',
      });
    }
    console.error(`Error verifying user: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

app.get('/variables', async (req, res) => {
  const { claim_id, token } = req.query;

  if (!claim_id || !token) {
    return res.status(400).json({
      success: false,
      message: 'claim_id and token are required',
    });
  }

  try {
    const response = await axios.get(
      `${process.env.CADRE_BASE_URL}/v1/editor/claim_placeholders/${claim_id}`,
      {
        params: { token },
      }
    );
    const claimDetails = response.data;

    res.json({
      success: true,
      claim: claimDetails,
    });
  } catch (error) {
    console.error(`Error fetching claim details: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to DB 📦');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} 🚀`);
    });
  })
  .catch((error) => {
    console.error(`❌ Error connecting to database: ${error.message}`);
  });
