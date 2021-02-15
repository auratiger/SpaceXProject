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

app.get('/launch', (req, res) => {
  const launch_id = req.query.launch_id;
  axios.get(`https://api.spacexdata.com/v3/launches/${launch_id}`)
    .then(response => {
      console.log("----------------------------------------------");
      console.log(response.data);
      res.json(response.data);
    })
    .catch(error => {
      console.log(error);
    })
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});

app.get('/rocket', (req, res) => {
  const rocket_id = req.query.rocket_id;

  axios.get(`https://api.spacexdata.com/v3/rockets/${rocket_id}`)
    .then(response => {
      console.log("================================================");
      console.log(response.data);
      res.json(response.data);
    })
    .catch(error => {
      console.log(error);
    })
})