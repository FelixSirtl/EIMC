
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

Blockly.defineBlocksWithJsonArray([
  // Block for colour picker.






{
  "type": "line",
  "message0": "_______________",
  "inputsInline": false,
  "previousStatement": "Query",
  "nextStatement": "Query",
  "colour": "#616a6b",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "istgleich",
  "message0": "%1 %2",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "k",
      "options": [
        [
          "=",
          "="
        ],
        [
          "<",
          "<"
        ],
        [
          ">",
          ">"
        ],
        [
          "≤",
          "<="
        ],
        [
          "≥",
          ">="
        ]
      ]
    },
    {
      "type": "input_value",
      "name": "ist"
    }
  ],
  "output": null,
  "colour": 299,
  "tooltip": "",
  "helpUrl": ""
},


{
  "type": "integernodezwischennode",
  "message0": "%1 %2",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "k",
      "options": [
        [
          "1",
          "1"
        ],
        [
          "2",
          "2"
        ],
        [
          "3",
          "3"
        ],
        [
          "4",
          "4"
        ],
        [
          "5",
          "5"
        ]
      ]
    },
    {
      "type": "input_value",
      "name": "NAME"
    }
  ],
  "output": null,
  "colour": 299,
  "tooltip": "",
  "helpUrl": ""
},


{
  "type": "integernode",
  "message0": "%1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "o",
      "options": [
        [
          "1",
          "1"
        ],
        [
          "2",
          "2"
        ],
        [
          "3",
          "3"
        ],
        [
          "4",
          "4"
        ],
        [
          "5",
          "5"
        ]
      ]
    }
  ],
  "output": null,
  "colour": 299,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "AND",
  "message0": "AND",
  "inputsInline": false,
  "previousStatement": "Query",
  "nextStatement": "Query",
  "colour": " #515a5a",
  "tooltip": "",
  "helpUrl": ""
},




{
  "type": "property_identifier",
  "message0": "%1 %2",
  "args0": [

    {
      "type": "field_dropdown",
      "name": "Drop",
      "options": [
        ["FireRating", "FireRating"],
        ["IsExternal", "IsExternal"],
        ["ThermalTrancemittance", "ThermalTrancemittance"],
        ["AcousticRating", "AcousticRating"],
        ["LoadBearing", "LoadBearing"],
        ["Combustible", "Combustible"],
        ["Own entity", "OWN_STRING"]
      ]
    },
    {
      "type": "input_value",
      "name": "own_entity",
      "check": "entity"
     
    },
 
   
  ],
  
  "output": null,
  "colour": 340,
  "tooltip": "",
  
  "mutator": "identifier_mutator"
},


{
  "type": "propertyset_identifier",
  "message0": "%1 %2",
  "args0": [

    {
      "type": "field_dropdown",
      "name": "Drop",
      "options": [
        ["Pset_WallCommon", "Pset_WallCommon"],
        ["Pset_WindowCommon", "Pset_WindowCommon"],
        ["Pset_DoorCommon", "Pset_DoorCommon"],
        ["Pset_BuildingElementProxyCommon", "Pset_BuildingElementProxyCommon"],
        ["Own_Pset", "OWN_STRING"]
      ]
    },

    {
      "type": "input_value",
      "name": "own_entity",
      "check": "entity"
     
    },
 
   
  ],
  
  "output": null,
  "colour": 359,
  "tooltip": "",
  
  "mutator": "identifier_mutator"
},

{
  "type": "attribute_identifier",
  "message0": "%1 %2",
  "args0": [

    {
      "type": "field_dropdown",
      "name": "Drop",
      "options": [
        ["Overall Height", "OverallHeight"],
        ["Overall Width", "OverallWidth"],
        ["Own entity", "OWN_STRING"]
      ]
    },
    {
      "type": "input_value",
      "name": "own_entity",
      "check": "entity"
     
    },
 
   
  ],
  
  "output": null,
  "colour": 23,
  "tooltip": "",
  
  "mutator": "identifier_mutator"
},

{
  "type": "Test_identifier",
  "message0": "%1 %2",
  "args0": [
   
    {
      "type": "field_dropdown",
      "name": "testdrop",
      "options": [
        ["Walls", "IfcWall"],
        ["Windows", "IfcWindow"],
        ["Doors", "IfcDoor"],
        ["Beams", "IfcBeam"],
        ["Columns", "IfcColumns"],
        ["Slabs", "IfcSlab"],
        ["Own entity", "OWN_STRING"]
      ]
    },
    {
      "type": "input_dummy",
      "name": "why"
    },
  ],
  "output": null,
  "colour": " #d98880 ",
  "tooltip": "",
  "helpUrl": "",
  "mutator": "testidentifier_mutator"
},



]);







Blockly.Constants.MUTATOR_MIXIN = {

  mutationToDom: function() {
    var container = Blockly.utils.xml.createElement('mutation');
    var divisorInput = (this.getFieldValue('testdrop') == 'OWN_STRING');
    container.setAttribute('divisor_input', divisorInput);
    return container;
  },
  /**
   * Parse XML to restore the 'divisorInput'.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function(xmlElement) {
    var divisorInput = (xmlElement.getAttribute('divisor_input') == 'true');
    this.updateShape_(divisorInput);
  },
  /**
   * Modify this block to have (or not have) an input for 'is divisible by'.
   * @param {boolean} divisorInput True if this block has a divisor input.
   * @private
   * @this {Blockly.Block}
   */
  updateShape_: function(divisorInput) {
    // Add or remove a Value Input.
    var inputExists = this.getInput('DIVISOR');
    if (divisorInput) {
      if (!inputExists) {
        
        this.appendDummyInput('DIVISOR')
            .appendField(new Blockly.FieldTextInput("enter own string"), "testdrop");
            
        
            
      }
      this.removeInput('why');
  
    } else if (inputExists) {
      this.removeInput('DIVISOR');
    }
  }
    
  
  };
  
  
  Blockly.Constants.MUTATOR_EXTENSION = function() {
    this.getField('testdrop').setValidator(function(option) {
      var divisorInput = (option == 'OWN_STRING');
      this.getSourceBlock().updateShape_(divisorInput);
    });
  };
  
  Blockly.Extensions.registerMutator('testidentifier_mutator',
      Blockly.Constants.MUTATOR_MIXIN,
      Blockly.Constants.MUTATOR_EXTENSION);
  

/* mutator 1
*/

Blockly.Constants.IS_DIVISIBLEBY_MUTATOR_MIXIN = {

mutationToDom: function() {
  var container = Blockly.utils.xml.createElement('mutation');
  var divisorInput = (this.getFieldValue('Drop') == 'OWN_STRING');
  container.setAttribute('divisor_input', divisorInput);
  return container;
},
/**
 * Parse XML to restore the 'divisorInput'.
 * @param {!Element} xmlElement XML storage element.
 * @this {Blockly.Block}
 */
domToMutation: function(xmlElement) {
  var divisorInput = (xmlElement.getAttribute('divisor_input') == 'true');
  this.updateShape_(divisorInput);
},
/**
 * Modify this block to have (or not have) an input for 'is divisible by'.
 * @param {boolean} divisorInput True if this block has a divisor input.
 * @private
 * @this {Blockly.Block}
 */
updateShape_: function(divisorInput) {
  // Add or remove a Value Input.
  var inputExists = this.getInput('DIVISOR');
  if (divisorInput) {
    if (!inputExists) {
      
      this.appendValueInput('DIVISOR')
          .appendField(new Blockly.FieldTextInput("enter own string"), "testit")
          .setCheck('entity');
      
          
    }
    this.removeInput('own_entity');

  } else if (inputExists) {
    this.removeInput('DIVISOR');
  }
}
  

};




Blockly.Constants.IS_DIVISIBLE_MUTATOR_EXTENSION = function() {
  this.getField('Drop').setValidator(function(option) {
    var divisorInput = (option == 'OWN_STRING');
    this.getSourceBlock().updateShape_(divisorInput);
  });
};

Blockly.Extensions.registerMutator('identifier_mutator',
    Blockly.Constants.IS_DIVISIBLEBY_MUTATOR_MIXIN,
    Blockly.Constants.IS_DIVISIBLE_MUTATOR_EXTENSION);

/* mutator 1 end
*/



Blockly.Blocks['type_filter'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck(null)
        .appendField("TF")
        .appendField(new Blockly.FieldImage("https://abload.de/img/typefilterpngxlkp2.png", 15, 15, { alt: "bild kann nicht geladen werden", flipRtl: "FALSE" }));
    this.setPreviousStatement(true, "Query");
    this.setNextStatement(true, "Query");
    this.setColour(0);
 this.setTooltip("TypeFilter: Operator filters Ifc types");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['Projector'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck(null)
        .appendField("Projector")
        .appendField(new Blockly.FieldImage("https://abload.de/img/projectorxdjx1.png", 15, 15, { alt: "bild kann nicht geladen werden", flipRtl: "FALSE" }));
    this.setPreviousStatement(true, "Query");
    this.setNextStatement(true, "Query");
    this.setColour(200);
 this.setTooltip("Projector: Dissolves Relations to Sets");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['property_filter'] = {
  init: function() {
    this.appendValueInput("Property_Filter")
        .setCheck(null)
        .appendField("PF")
        .appendField(new Blockly.FieldImage("https://abload.de/img/testproperty1ibjwe.png", 15, 15, { alt: "*", flipRtl: "FALSE" }));
    this.setPreviousStatement(true, "Query");
    this.setNextStatement(true, "Query");
    this.setColour(180);
 this.setTooltip("PropertyFilter: Operator filters properties");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['xcheck'] = {
  init: function() {
    this.appendValueInput("XCheck")
        .setCheck(null)
        .appendField("XCheck")
        .appendField(new Blockly.FieldImage("https://abload.de/img/check23sjo4.png", 15, 15, { alt: "*", flipRtl: "FALSE" }));
    this.setPreviousStatement(true, "Check");
    this.setNextStatement(true, "Check");
    this.setColour(102);
 this.setTooltip("XCheck: general Check operator");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['attributecheck'] = {
  init: function() {
    this.appendValueInput("ACheck")
        .setCheck(null)
        .appendField("ACheck")
        .appendField(new Blockly.FieldImage("https://abload.de/img/check23sjo4.png", 15, 15, { alt: "*", flipRtl: "FALSE" }));
    this.setPreviousStatement(true, "Check");
    this.setNextStatement(true, "Check");
    this.setColour(106);
 this.setTooltip("AttributeCheck: Attribute Check operator");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['propertycheck'] = {
  init: function() {
    this.appendValueInput("PCheck")
        .setCheck(null)
        .appendField("PCheck")
        .appendField(new Blockly.FieldImage("https://abload.de/img/check23sjo4.png", 15, 15, { alt: "*", flipRtl: "FALSE" }));
    this.setPreviousStatement(true, "Check");
    this.setNextStatement(true, "Check");
    this.setColour(110);
 this.setTooltip("PropertyCheck: Property Check operator");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['importmodel'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldLabelSerializable("ImportModel             "), "ImportModel")
        .appendField(new Blockly.FieldTextInput("Input file path to IFC model"), "Importquery");
    this.setNextStatement(true, "ST");
    this.setColour(230);
  
 this.setTooltip("");
 this.setHelpUrl("");
 
  }
};

Blockly.Blocks['applicability'] = {
  init: function() {
    this.appendDummyInput();
    this.appendStatementInput("NAME")
        .setCheck("Query")
        .appendField("Applicability");
    this.appendDummyInput();
    this.setPreviousStatement(true, "ST");
    this.setNextStatement(true, "ST");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['validation'] = {
  init: function() {
    this.appendDummyInput();
    this.appendStatementInput("NAME")
        .setCheck("Check")
        .appendField("Validation   ");
    this.appendDummyInput();
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("Download-Link"), "Download");
    this.setPreviousStatement(true, "ST");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['exportmodel'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Export Model     ");
    this.appendDummyInput();
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("Download-Link"), "Download");
    this.setPreviousStatement(true, "ST");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['attribute_filter'] = {
  init: function() {
    this.appendValueInput("attribute_Filter")
        .setCheck(null)
        .appendField("AF")
        .appendField(new Blockly.FieldImage("https://abload.de/img/attributefilteruokxe.png", 15, 15, { alt: "*", flipRtl: "FALSE" }));
    this.setPreviousStatement(true, "Query");
    this.setNextStatement(true, "Query");
    this.setColour(45);
 this.setTooltip("AttributeFilter: Operator filters attributes");
 this.setHelpUrl("");
  }
};



Blockly.Blocks['trueblocks'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["true","true"], ["false","false"]]), "trueblock");
    this.setOutput(true, null);
    this.setColour(299);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};




Blockly.Blocks['Identifier'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("enter own input"), "Tt");
    this.setOutput(true, null);
    this.setColour(299);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['true'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["TRUE","true"], ["False","false"]]), "true");
    this.setOutput(true, null);
    this.setColour(299);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};



Blockly.JavaScript['play_sound'] = function(block) {
  let value = '\'' + block.getFieldValue('VALUE') + '\'';
  return 'MusicMaker.queueSound(' + value + ');\n';
};


