'use strict';
const express = require('express')
const router = express.Router(); // eslint-disable-line new-cap
const Models = require('../../../db');
const Power = Models.Power;

// ROUTES BEGINNING '/api/powers'

//Get all powers (or all powers of a specified category)
router.get('/', function(req, res, next){
    Power.findAll({where: req.query})
        .then(allPower => res.status(200).send(allPower))
        .catch(next);
})

//Get a specific power by Id
router.get('/:powerId', function(req, res, next){
    Power.findById(req.params.powerId)
        .then(foundPower => res.status(200).send(foundPower))
        .catch(next);
})

///////////////////////////////
//////ADMIN ROUTES BELOW///////
///////////////////////////////

//Create a new power
router.post('/create', function(req, res, next){
    Power.create(req.body)
        .then(createdPower => createdPower.setCategory(req.body.categoryId))
        .then(createdPowerWithAssociation => res.status(200).send(createdPowerWithAssociation))
        .catch(next);
})

//Modify a power
router.put('/:powerId', function(req, res, next){
    Power.findById(req.params.powerId)
        .then(powerFound => powerFound.update(req.body))
        .then(updatedPower => res.status(200).send(updatedPower))
        .catch(next);
});

// //Delete a power
// router.delete('/:powerId', function(req, res, next){
//     Power.findById(req.params.powerId)
//         .then(foundPower => foundPower.destroy())
//         .then(destroyedPower => res.status(200).send(destroyedPower))
//         .catch(next);
// })

module.exports = router;
