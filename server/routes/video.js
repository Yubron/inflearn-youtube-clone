const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if(ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true);
    }
});

const upload = multer({storage : storage}).single("file");

//=================================
//             Video
//=================================

router.post('/uploadFiles', (req, res) => {

    // save into server from client
    upload(req, res, err => {
        if(err) {
            return res.json({ success : false, err })
        }
        return res.json({success:true, url: res.req.file.path, fileName: res.req.file.filename})
    })

})

router.get('/getVideos', (req, res) => {

    // get videos then send to client
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })
})

router.post('/getVideoDetail', (req, res) => {

    // get videos then send to client
    Video.findOne( {"_id" : req.body.videoId })
       .populate('writer')
       .exec((err, videoDetail) => {
           if(err) return res.status(400).send(err)
           return res.status(200).json({success : true, videoDetail});
       })
})


router.post('/thumbnail', (req, res) => {
    let filePath = '';
    let fileDuration = '';

    // create thumbnail and get running time of video
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        
        fileDuration = metadata.format.duration;
    })
    
    // crate thumbnail
    ffmpeg(req.body.url)
    .on('filenames', function (filenames) {
        console.log(filenames);
        filePath = 'uploads/thumbnails/' + filenames[0];
    })
    .on('end', function() {
        return res.json({success: true, url: filePath, fileDuration: fileDuration});
    })
    .on('error', function(err) {
        console.log(err);
        return res.json({success: false, err});
    })
    .screenshots({
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        filename: 'thumbnail-%b.png'
    })
})

router.post('/uploadVideo', (req, res) => {

    // save video
    const video = new Video(req.body);
    video.save((err, doc) => {
        if(err) return res.json({success : false, err})
        res.status(200).json({success: true});
    });
})

router.post('/getSubscriptionVideos', (req, res) => {

    // get subscription from userId
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec(( err, subscriberInfo ) => {
            if(err) return res.status(400).send(err);

            let subscribedUser = [];

            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo);
            });

            Video.find({ writer : { $in : subscribedUser } })
                .populate('writer')
                .exec((err, videos) => {
                    if(err) return res.status(400).send(err);
                    res.status(200).json({ success: true, videos })
                })
        });
    
    // get videos from subscription
    
    
})

module.exports = router;
