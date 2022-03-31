// Generated by CoffeeScript 2.6.1
var mutate, utils;

({mutate} = require('mixme'));

utils = require('../../utils');

module.exports = {
  name: '@nikitajs/core/lib/plugins/metadata/position',
  require: ['@nikitajs/core/lib/plugins/history'],
  hooks: {
    'nikita:schema': function({schema}) {
      return mutate(schema.definitions.metadata.properties, {
        depth: {
          type: 'integer',
          description: `Indicates the level number of the action in the Nikita session tree.`,
          default: 0,
          readOnly: true
        },
        index: {
          type: 'integer',
          description: `Indicates the index of an action relative to its sibling actions in
the Nikita session tree.`,
          default: 0,
          readOnly: true
        },
        position: {
          type: 'array',
          items: {
            type: 'integer'
          },
          description: `Indicates the position of the action relative to its parent and
sibling action. It is unique to each action.`,
          default: [0],
          readOnly: true
        }
      });
    },
    'nikita:normalize': {
      after: '@nikitajs/core/lib/plugins/history',
      handler: function(action) {
        action.metadata.depth = action.parent ? action.parent.metadata.depth + 1 : 0;
        // plugins are not activated in the root session with {depth: 0}
        action.metadata.index = action.siblings ? action.siblings.length : 0;
        return action.metadata.position = action.parent ? action.parent.metadata.position.concat([action.metadata.index]) : [0];
      }
    },
    'nikita:action': function(action) {
      if (typeof action.metadata.depth !== 'number') {
        throw utils.error('METADATA_DEPTH_INVALID_VALUE', ["configuration `depth` expect an integer value,", `got ${JSON.stringify(action.metadata.depth)}.`]);
      }
    }
  }
};