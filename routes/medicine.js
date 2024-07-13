const express = require('express');
const multer = require('multer');
const router = express.Router();
const Medicine = require('../models/medicine');

// 设置Multer用于处理文件上传
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 药品查询部分
// ==================
// 获取药品列表
router.get('/', async (req, res) => {
    try {
        const medicine = await Medicine.find()
        res.status(200).json({
            status: '10000',
            message: '请求成功',
            medicine: medicine
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: '10099',
            message: '内部服务器错误'
        });
    }
});


// 药品管理部分
// ===========================

// 拦截普通用户的请求
router.all('/*', function (req, res, next) {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            status: '10013',
            message: '无访问权限！'
        });
    }
});


// 添加药品
router.post('/manage', async (req, res) => {
    const name = req.body.name;
    // 检查药品是否已存在
    if (!req.body.name) return res.status(400).json({
        status: '10022',
        message: '请求为空，请检查请求内容'
    });
    Medicine.findOne({ 'name': name }).then(existingMedicine => {
        if (existingMedicine) {
            return res.status(400).json({
                status: '10022',
                message: '药品已存在'
            });
        }
        // 创建新药品
        const newMedicine = new Medicine({
            name: name,
            type: req.body.type,
            price: req.body.price,
            picture_url: req.body.picture_url
        });
        newMedicine.save()
            .then(savedDocument => {
                // 处理保存成功后的逻辑
                console.log('Medcine saved:', savedDocument.name);
                return res.status(201).json({
                    status: '10000',
                    message: '药品添加成功',
                    medicineId: savedDocument._id
                });
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    status: '10022',
                    message: '添加失败，请检查请求内容'
                });
            });

    }).catch(err => {
        return res.status(500).json({
            status: '10099',
            message: '服务器内部错误'
        });
    });
});

// 上传图片接口
router.post('/manage/image', upload.single('image'), async (req, res) => {
    if (!req.file)
        return res.status(400).json({
            status: '10022',
            message: '上传文件为空，请检查请求内容'
        });
    const { buffer, mimetype } = req.file
    try {
        // medicineId参数用于传递药品ID
        const medicineId = req.body.medicineId;
        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({
                status: '10023',
                message: '未找到该药品，请检查请求内容'
            });
        }

        // 将上传的图片数据添加到Medicine模型的image中
        medicine.picture = {
            data: buffer,
            contentType: mimetype
        };
        await medicine.save()
            .then(savedDocument => {
                return res.status(200).json({
                    status: '10000',
                    message: '上传成功',
                });
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    status: '10022',
                    message: '上传有误，请检查请求内容'
                });
            });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: '10099',
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;