const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());

app.get('/launches', (req, res) => {
  const offset = req.query.offset;
  const limit = req.query.limit;
  axios.get('https://api.spacexdata.com/v3/launches', {params: {offset: offset, limit:limit}})
    .then(response => {
      console.log(response.data);
      res.json(response.data);
    })
    .catch(error => {
      console.log(error);
    })
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});