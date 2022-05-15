const express = require('express');
const router = express.Router();

const customerControler = require('../app/controllers/controller.customer');


// router.get('/store', customerControler.store);
router.get('/:email', customerControler.show);
router.put('/update/:email', customerControler.update);
router.get('/', customerControler.index);

module.exports = router;