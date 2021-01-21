const express = require('express');
const router = express.Router();
const { Subscriber } = require('../models/Subscriber');


// subscribe

router.post('/subscriberNumber',(req,res) => {
    console.log('subscriberNumber router called');

    // subscriber 수를 리턴한다. length 로 하면 간단...
    Subscriber.find({'userTo':req.body.userTo})
    .exec((err,subscribe) => {
        if(err) return res.status(400).send(err);
        return res.status(200).json({success:true,subscribeNumber:subscribe.length})
    })
});

router.post('/subscribed',(req,res) => {
    console.log('subscribed router called');

    // subscriber 수를 리턴한다. length 로 하면 간단...
    Subscriber.find({'userTo':req.body.userTo , 'userFrom':req.body.userFrom})
    .exec((err,subscribe) => {
        if(err) return res.status(400).send(err);
        let result = false
        if(subscribe.length !== 0) {
            result = true
        }
        return res.status(200).json({success:true,subscribed:result})
    })
});


router.post('/unSubscribe',(req,res) => {
    console.log('un Subscribe router called');

    // subscriber 수를 리턴한다. length 로 하면 간단...
    Subscriber.findOneAndDelete({'userTo':req.body.userTo , 'userFrom':req.body.userFrom})
    .exec((err,doc) => {
        if(err) return res.status(400).json({success:false , err});
        return res.status(200).json({success:true,doc})
    })
});

router.post('/subscribe',(req,res) => {
    console.log('enroll Subscribe router called');

    const subscribe = new Subscriber(req.body)

    subscribe.save((err,doc) => {
        if(err) return res.json({success:false,err})
        return res.status(200).json({success:true,doc})
    })
});


module.exports = router;
