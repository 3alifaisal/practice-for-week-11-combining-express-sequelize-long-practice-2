// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();

const { OP , Sequelize } = require("sequelize");
const { Insect } = require("../db/models");

router.get("/", async (req,res,next) => {
    let insects =await  Insect.findAll({
        attributes: ["name","millimeters","territory"],
        order: [["millimeters","DESC"]]
    })
    res.json(insects);
})
router.get("/:id",async (req,res,next)=> {
    let insect = [];
    try{
    insect = await Insect.findOne({
        attributes: ["name", "millimeters", "territory", "description","fact"]  ,
        where: {
            id: req.params.id
        }
    })
    if(!insect) throw Error("not matching id ");
    res.json(insect);

    } catch (err) {
        next({
            status: "error",
            message: `Could not find insect ${req.params.id}`,
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
    }
})

router.post("/",async(req,res,next)=> {

  const  {name,description,fact,territory,millimeters} = req.body;
try{
  let newinsect = Insect.create({
    name,
    description,
    fact,
    territory,
    millimeters
  })
    res.json({
        status: "success",
        message: "Successfully created new tree",
        data: newinsect
    });
    } catch (err) {
    next({
        status: "error",
        message: 'Could not create new Insect',
        details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
    })
    }
})


router.delete('/:id', async (req, res, next) => {
    try {
        let insect = await Insect.findByPk(req.params.id);
      
        if (!insect) {
            next({
                status: "not-found",
                message: `Could not remove insect ${req.params.id}`,
                details: `Insect not found`
            }
            );
        }
        await insect.destroy()
        res.json({
            status: "success",
            message: `Successfully removed insect ${req.params.id}`,
        });
    } catch (err) {
        next({
            status: "error",
            message: `Could not remove insect ${req.params.id}`,
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        // Your code here

        const { name, description, fact, territory, millimeters } = req.body;
        const insect = await Insect.findByPk(req.params.id);

        if (!insect) {
            next({
                status: "not-found",
                message: `Could not update insect ${req.params.id}`,
                details: `Insect not found`

            });
            return;
        }
        if (id !== insect.id) {
            next({
                status: "error",
                message: "Could not update insect",
                details: `${req.params.id} does not match ${id}`

            });
            return;
        }
        await insect.update({
            name,
            description,
            fact,
            territory,
            millimeters
        })
        res.json({
            status: "success",
            message: "Successfully updated insect",
            data: insect
        })
    } catch (err) {
        next({
            status: "error",
            message: 'Could not update new insect',
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
    }
});


router.get('/search/:value', async (req, res, next) => {
    let insects = [];
    try {
        insects = await Insect.findAll({
            attributes: ["name", "millimeters", "territory"],
            where: {
                name: {
                    [Sequelize.Op.like]: `%${req.params.value}%`
                }
            }
        })

        res.json(insects);
    } catch (err) {
        next({
            status: "error",
            message: 'Could not find insect',
            details: err.errors ? err.errors.map(item => item.message).join(', ') : err.message
        });
    }
});

// Export class - DO NOT MODIFY
module.exports = router;



// const insects = [
//     {
//         name: 'Western Pygmy Blue Butterfly',
//         description: 'Copper brown and dull blue pattern at the bases of both wings',
//         fact: 'Prehistoric fossils suggests that butterflies have been around for more than 200 million years',
//         territory: 'North America and as far west as Hawaii and the middle east',
//         millimeters: 12,
//     },
//     {
//         name: 'Patu Digua Spider',
//         description: 'Smaller than even the head of a pin',
//         fact: 'Generally, male spiders are smaller than the females',
//         territory: 'Rio Digua river near the El Queremal, Valle del Cauca region of northern Colombia',
//         millimeters: 0.33,
//     },
// ]