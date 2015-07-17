var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');

var mongoose = require('mongoose');
var User = mongoose.model('User');

var auth = jwt({secret:'SECRET', userProperty: 'payLoad'});
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET All cards */
router.get('/cards', function(req, res, next){
    Card.find(function(err, cards){
        if (err) {next(err);};

        res.json(cards);
    });
});

/* Get Specific Card by ID */
router.get('/cards/:card', function(req, res, next){
    res.json(req.card);
});

/* POST Register a new user*/
router.post('/register', function(req, res, next){
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message:'Please fill out all fields'});
    };

    var user = new User();

    user.username = req.body.username;
    user.setPassword(req.body.password);

    user.save(function(err){
        if (err) {return next(err);};

        return res.json({token:user.generateJWT()});
    });
});

/*POST login */
router.post('/login', function(req, res, next){
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message:'Please fill out all fields'});
    };

    passport.authenticate('local', function(err, user, info){
        if (err) {return next(err);};

        if (user) {
            return res.json({token:user.generateJWT()});
        } else {
            return res.status(401).json(info);
        };
    })(req,res,next);
});

/* POST - Create new card */
router.post('/cards', function(req, res, next){
    var card = new Card(req.body);
    card.save(function(err, card){
        if (err) {next(err);};

        res.json(card);
    });
});

// router.put('/cards/:existingCard/modify', function(req, res, next){
//     console.log('beginning update');
//     var cardValues = new Card(req.body);
//     console.log('card = ' + cardValues + 'id + ');
//     Card.findOneAndUpdate(
//         {_id:req.params.existingCard},
//         cardValues,
//         function(err, updatedCard){
//             if (err) {return next(err);};
//             // console.log('no error ' + updatedCard + ' ' + ' ' + err);
//             if (!updatedCard) {return next(new Error('Somehow we couldn\'t update the card.'))};
//             // console.log('updated card exists');

//             res.json(updatedCard);
//         });
// });

// router.put('/leaderCards/:existingLeaderCard/modify', function(req, res, next){
//     console.log('beginning update');
//     var cardValues = new LeaderCard(req.body);
//     console.log(cardValues);
//     console.log(req.body);
//     console.log(req.params.existingLeaderCard);
//     LeaderCard.findOneAndUpdate(
//         {_id:req.params.existingLeaderCard},
//         cardValues,
//         function(err, updatedCard){
//             if (err) {return next(err);};
//             // console.log('no error ' + updatedCard + ' ' + ' ' + err);
//             if (!updatedCard) {return next(new Error('Somehow we couldn\'t update the card.'))};
//             // console.log('updated card exists');

//             res.json(updatedCard);
//         });
// });

// router.param('card', function(req,res,next,id){
//     var query = Card.findById(id);

//     query.exec(function(err, card){
//         if(err){return next(err);};
//         if(!card){return next(new Error('card doesn\' exist'))};

//         req.card = card;
//         return next();
//     });
// });

// router.param('leaderCard', function(req,res,next,id){
//     var query = LeaderCard.findById(id);
//     query.exec(function(err, leaderCard){
//         if(err){return next(err);};
//         if(!leaderCard){return next(new Error('leaderCard doesn\' exist'))};

//         req.leaderCard = leaderCard;
//         return next();
//     });
// });


// router.param('deck', function(req,res,next,id){
//     var query = Deck.findById(id);

//     query.exec(function(err, deck){
//         if (err) {return next(err);};
//         if (!deck) {return next(new Error('can\'t find deck'))};

//         req.deck = deck;
//         return next();
//     });
// });

module.exports = router;