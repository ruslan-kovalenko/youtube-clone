const express = require("express");
const path = require('path');
const router = express.Router();
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const { Video } = require("../models/Video");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname)

    if (ext !== '.mp4') {
        cb('Only video files are allowed', true);
    }

    cb(null, true)
}

const upload = multer({ storage: storage, fileFilter: fileFilter }).single("file")

router.post("/upload", (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ err })
        }
        return res.json({ filePath: res.req.file.path, fileName: res.req.file.filename })
    })
});

router.post("/thumbnail", (req, res) => {
    let thumbsFilePath = '',
        fileDuration = '';

    ffmpeg.ffprobe(req.body.filePath, (err, metadata) => {
        fileDuration = metadata.format.duration;
    })

    ffmpeg(req.body.filePath)
        .on('filenames', (filenames) => {
            thumbsFilePath = `uploads/thumbnails/${filenames[0]}`;
        })
        .on('end', () => {
            return res.json({ thumbsFilePath, fileDuration})
        })
        .screenshots({
            count: 4,
            folder: 'uploads/thumbnails',
            size:'320x240',
            filename:'thumbnail-%b.png',
        });
});

router.post("/create", (req, res) => {
    const video = new Video(req.body);

    video.save((err, video) => {
        if (err) return res.status(400).json({ err })
        return res.status(200).json('success')
    })
});

router.get("/getVideos", (req, res) => {
    Video.find()
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ videos })
        })
});

router.post("/getVideo", (req, res) => {
    Video.findOne({ "_id": req.body.videoId })
    .exec((err, video) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ video })
    })
});

module.exports = router;