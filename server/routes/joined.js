// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();

// Import models - DO NOT MODIFY
const { Insect, Tree } = require('../db/models');
const { Op } = require("sequelize");

/**
 * PHASE 7 - Step A: List of all trees with insects that are near them
 *
 * Approach: Eager Loading
 *
 * Path: /trees-insects
 * Protocol: GET
 * Response: JSON array of objects
 *   - Tree properties: id, tree, location, heightFt, insects (array)
 *   - Trees ordered by the tree heightFt from tallest to shortest
 *   - Insect properties: id, name
 *   - Insects for each tree ordered alphabetically by name
 */
router.get('/trees-insects', async (req, res, next) => {
    let trees = [];
    

    trees = await Tree.findAll({
        attributes: ['id', 'tree', 'location', 'heightFt'],
        include: {
            attributes: ['id','name'],
            model: Insect,
            required: true,
            through: {
                attributes: []
            },
           
        },
        order: [['id'],[Insect, 'name']]
    });

    res.json(trees);
});

/**
 * PHASE 7 - Step B: List of all insects with the trees they are near
 *
 * Approach: Lazy Loading
 *
 * Path: /insects-trees
 * Protocol: GET
 * Response: JSON array of objects
 *   - Insect properties: id, name, trees (array)
 *   - Insects for each tree ordered alphabetically by name
 *   - Tree properties: id, tree
 *   - Trees ordered alphabetically by tree
 */
router.get('/insects-trees', async (req, res, next) => {
    let payload = [];

    const insects = await Insect.findAll({
        attributes: ['id', 'name', 'description'],
        order: [ ['name'] ],
    });
    for (let i = 0; i < insects.length; i++) {
        const insect = insects[i];

        const insectTrees = await insect.getTrees({
            attributes: ['id', 'tree'],
            order: [['tree', 'asc']],
            joinTableAttributes: []
           // remove extra data
        });   
        payload.push({
            id: insect.id,
            name: insect.name,
            description: insect.description,
            trees: insectTrees //insectTreesForOutput 
        });
    }

    res.json(payload);
});

/**
 * ADVANCED PHASE 3 - Record information on an insect found near a tree
 *
 * Path: /associate-tree-insect
 * Protocol: POST
 * Parameters: None
 * Request Body: JSON Object
 *   - Property: tree Object
 *     with id, name, location, height, size
 *   - Property: insect Object
 *     with id, name, description, fact, territory, millimeters
 * Response: JSON Object
 *   - Property: status
 *     - Value: success
 *   - Property: message
 *     - Value: Successfully recorded information
 *   - Property: data
 *     - Value: object (the new tree)
 * Expected Behaviors:
 *   - If tree.id is provided, then look for it, otherwise create a new tree
 *   - If insect.id is provided, then look for it, otherwise create a new insect
 *   - Relate the tree to the insect
 * Error Handling: Friendly messages for known errors
 *   - Association already exists between {tree.tree} and {insect.name}
 *   - Could not create association (use details for specific reason)
 *   - (Any others you think of)
 */
// Your code here
// this is cp paste from Dmytro i got too lazy but don't do like me 
router.post('/associate-tree-insect', async (req, res, next) => {
    // The request body is expected to have two attributes: tree and insect
    try {
       
        let tree;
        let insect;

        if (!req.body.tree) {
            next({
                status: "error",
                message: `Could not update tree`,
                details: 'tree object not exist in request'
            });
        } else if (req.body.tree.id) {
            tree = await Tree.findByPk(req.body.tree.id)
            if (!tree) {
                next({
                    status: "error",
                    message: `Could not update tree`,
                    details: `Tree not exist with id ${req.body.tree.id}`
                });
            };
        } else { // tree exist with body, saving
            // here we can also check all keys exists

            tree = await Tree.create({
                tree: req.body.tree.name,
                location: req.body.tree.location,
                heightFt: req.body.tree.height,
                groundCircumferenceFt: req.body.tree.size
            });


        };

        // same for insect
        if (!req.body.insect) {
            next({
                status: "error",
                message: `Could not update insect`,
                details: 'insect object not exist in request'
            });
        } else if (req.body.insect.id) {
            insect = await Insect.findByPk(req.body.insect.id)
            if (!insect) {
                next({
                    status: "error",
                    message: `Could not update insect`,
                    details: `Insect not exist with id ${req.body.insect.id}`
                });
            }
        } else { // tree exist with body, saving
            // here we can also check all keys exists
            insect = await Insect.create({
                name: req.body.insect.name,
                description: req.body.insect.description,
                fact: req.body.insect.fact,
                territory: req.body.insect.territory,
                millimeters: req.body.insect.millimeters
            });


        };

        if (req.body.tree.id && req.body.insect.id && (await tree.hasInsect(insect))) {
            next({
                status: "special error",
                message: `Could not create an association`,
                details: `Association already exists between ${tree.tree} and ${insect.name}`
            });
        } else { // all good, adding assosiation

            tree.addInsect(insect); // need only one
            //insect.addTree(tree);

            res.json({
                status: 'success',
                message: 'Successfully created association',
                data: {
                    tree: tree,
                    insect: insect
                }
            })

        }



    } catch (err) {
        next({
            status: "error",
            message: 'Could not update new tree',
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
    }
})

// Export class - DO NOT MODIFY
module.exports = router;