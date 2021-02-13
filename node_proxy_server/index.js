const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

app.get('/launches', (req, res) => {
  console.log("run");
  axios.get('https://api.spacexdata.com/v3/launches', {params: {limit: 10, offset: 0}})
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