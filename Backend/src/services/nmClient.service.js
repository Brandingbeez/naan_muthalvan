const axios = require('axios');
const NmClientToken = require('../models/NmClientToken');
const { NM_CLIENT_ID, NM_CLIENT_SECRET, NM_BASE_URL } = require('../config/env');

const getValidAccessToken = async () => {
  let tokenDoc = await NmClientToken.findOne().sort({ createdAt: -1 });
  if (tokenDoc && tokenDoc.expiresAt > new Date()) {
    return tokenDoc.accessToken;
  }
  // Refresh or get new
  const response = await axios.post(`${NM_BASE_URL}/oauth/token`, {
    client_id: NM_CLIENT_ID,
    client_secret: NM_CLIENT_SECRET,
    grant_type: 'client_credentials',
  });
  const { access_token, refresh_token, expires_in } = response.data;
  const expiresAt = new Date(Date.now() + expires_in * 1000);
  tokenDoc = await NmClientToken.create({
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt,
  });
  return access_token;
};

module.exports = { getValidAccessToken };