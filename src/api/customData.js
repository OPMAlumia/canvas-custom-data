const api = require('../services/api');
const router = require('express').Router();

router.get('/', async (req, res) => {
  const { method, userId, userData, keepDataAlive } = req.query;
  const keepData = keepDataAlive === "true"
    ? true
    : false

  if (!method) {
    return res.json({
      message: 'method not specified. Must be GET / PUT'
    })
  }

  if (!userId) {
    return res.json({
      message: 'userId not specified.'
    })
  }

  //if method it's diferent than 'GET' (PUT / DELETE) and keepDataAlive is not specified
  if (!keepDataAlive && method.toLowerCase() !== 'get') {
    return res.json({
      message: 'you must specify if you want to keep your data. keepDataAlive=true / false'
    })
  }

  //Function that gets all students data
  async function getUserDataById(id) {
    const data = await api
      .get(`/users/${id}/custom_data/?ns=${process.env.NS}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 11831~ZRIKdQl2hZ8lgkMyGog4ZyKlruZ3mqIHjpFj2EyfvV1s08BTHamExeLFTwze6GSf'
        }
      })
      .then(response => {
        console.log(response.data);
        return response.data;
      })
      .catch(error => {
        console.log(error)
        return false;
      })

    return data;
  }

  //METHODS
  if (method.toLowerCase() === 'get') {
    //GET by user id  {userId = canvas user_id}
    const userData = await getUserDataById(userId);
    return res.json(userData);

  } else if (method.toLowerCase() === "put" && !keepData) {
    //PUT !!WITHOUT KEEPING DATA ALIVE!! by user id
    //userData mustbe live {"data": {"my": "data", "some": "data"}}
    const payload = JSON.parse(userData);

    api
      .put(`/users/${userId}/custom_data/?ns=${process.env.NS}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 11831~ZRIKdQl2hZ8lgkMyGog4ZyKlruZ3mqIHjpFj2EyfvV1s08BTHamExeLFTwze6GSf'
        }
      })
      .then(response => {
        console.log(payload)
        return res.json(response.data)
      })
      .catch(error => {
        console.log(error)
        return res.json(error)
      })

  } else if (method.toLowerCase() === "put" && keepData) {
    let oldUserDataObject = (await getUserDataById(userId)).data;
    let dataToAppend = (JSON.parse(userData)).data;

    //Soma os dos objetos
    for (let index of Object.keys(dataToAppend)) {
      oldUserDataObject[index] = dataToAppend[index];
    }

    //Update
    api
      .put(`/users/${userId}/custom_data/?ns=${process.env.NS}`, {data: oldUserDataObject}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 11831~ZRIKdQl2hZ8lgkMyGog4ZyKlruZ3mqIHjpFj2EyfvV1s08BTHamExeLFTwze6GSf'
        }
      })
      .then(response => {
        return res.json(response.data)
      })
      .catch(error => {
        return res.json(error)
      })
  }

})

module.exports = router;
