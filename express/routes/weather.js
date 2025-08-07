const express = require('express');
const axios = require('axios');
const router = express.Router();



// od nowa trzeba napisać całą tą ścieżke, tak aby sprawdzała pogode dokładnie w miejscu startu najbliższej rakiety
// zamiast pobierać pogode jedynie z trzech miejsc
router.post('/', async (req, res) => {
    res.send(req.body)
})



module.exports = router;