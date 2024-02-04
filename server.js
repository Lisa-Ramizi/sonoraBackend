const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/api/new-releases', async (req, res, next) => {
  try {
    const CLIENT_ID = "a686172c8ab94620a181338642102439";
    const CLIENT_SECRET = "d36335100d00432590d93108ce1c0e62";

    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', authParameters);
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const newReleasesResponse = await fetch('https://api.spotify.com/v1/browse/new-releases?limit=8', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const newReleasesData = await newReleasesResponse.json();
    

    console.log('New Releases Data:', newReleasesData.albums.items);

    res.json(newReleasesData.albums.items);
  } catch (error) {
    console.error('Error fetching new releases:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
