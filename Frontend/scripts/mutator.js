Blockly.Extensions.register('math_op_tooltip',
    Blockly.Extensions.buildTooltipForDropdown(
        'OP', Blockly.Constants.Math.TOOLTIPS_BY_OP));


/**
 * Mixin for mutator functions in the 'math_is_divisibleby_mutator'
 * extension.
 * @mixin
 * @augments Blockly.Block
 * @package
 */
Blockly.Constants.ownEntity_mutator = {
  /**
   * Create XML to represent whether the 'divisorInput' should be present.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function() {
    var container = Blockly.utils.xml.createElement('mutation');
    var divisorInput = (this.getFieldValue('entities') == 'ownEntity');
    container.setAttribute('text_input', textInput);
    return container;
  },
  /**
   * Parse XML to restore the 'divisorInput'.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function(xmlElement) {
    var divisorInput = (xmlElement.getAttribute('entities') == 'true');
    this.updateShape_(textInput);
  },
  /**
   * Modify this block to have (or not have) an input for 'is divisible by'.
   * @param {boolean} textInput True if this block has a divisor input.
   * @private
   * @this {Blockly.Block}
   */
  updateShape_: function(textInput) {
    // Add or remove a Value Input.
    var inputExists = this.getInput('DIVISOR');
    if (textInput) {
      if (!textInput) {
        this.appendField(new Blockly.FieldTextInput("own entity"), "OWN")
            .setCheck('ifc_entity');
      }
    } else if (inputExists) {
      this.removeInput('DIVISOR');
    }
  }
};

/**
 * 'math_is_divisibleby_mutator' extension to the 'math_property' block that
 * can update the block shape (add/remove divisor input) based on whether
 * property is "divisible by".
 * @this {Blockly.Block}
 * @package
 */
Blockly.Constants.Math.ownEntity_mutator_EXTENSION = function() {
  this.getField('entities').setValidator(function(option) {
    var divisorInput = (option == 'DIVISIBLE_BY');
    this.getSourceBlock().updateShape_(divisorInput);
  });
};

Blockly.Extensions.registerMutator('math_is_divisibleby_mutator',
    Blockly.Constants.Math.ownEntity_mutator_MIXIN,
    Blockly.Constants.Math.ownEntity_mutator_EXTENSION);

// Update the tooltip of 'math_change' block to reference the variable.
