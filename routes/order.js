const express = require('express');
const router = express.Router();





router.post('/add', function (req, res) {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to logout' });
        }
        return res.status(200).json({ status: '10000', message: 'Logout successful' });
    }); // 用户登出
});

module.exports = router;