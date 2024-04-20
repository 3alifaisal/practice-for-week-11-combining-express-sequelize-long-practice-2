'use strict';

const { Insect, Tree } = require("../models")

const insectTrees = [
  {
    name: 'Western Pygmy Blue Butterfly',
    trees: [
      { name: 'General Sherman' },
      { name: 'General Grant' },
      { name: 'Lincoln' },
      { name: 'Stagg' }
    ]
  },
  {
    name: 'Patu Digua Spider',
    trees: [
      { name: 'Stagg' }
    ]
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 
    for (const insectTree of insectTrees) {
      const { name, trees } = insectTree;
      const insect = await Insect.findOne({
        where: { name }
      });

      for (const tree of trees) {
        let foundTree = await Tree.findOne({ where: { tree: tree.name } });
        await insect.addTree(foundTree);
      }
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (const insectTree of insectTrees) {
      const { name, trees } = insectTree;
      const insect = await Insect.findOne({
        where: { name }
      });

      for (const tree of trees) {
        let foundTree = await Tree.findOne({ where: { tree: tree.name } });
        await insect.removeTree(foundTree);
      }
    }
  }
};
