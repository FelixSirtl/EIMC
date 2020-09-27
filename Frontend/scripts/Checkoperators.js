    Blockly.Blocks['xchecktest'] = {

    init: function() {
        
  
     
     
      this.itemCount_ = 1;
      
      this.setInputsInline(false);
      
      this.updateShape_();

      this.setPreviousStatement(true, "Check");
      this.setNextStatement(true, "Check");
      this.setColour(100);
     
    
      this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
      this.setTooltip("hello");
    },

    mutationToDom: function() {
      var container = Blockly.utils.xml.createElement('mutation');
      container.setAttribute('items', this.itemCount_);
      return container;
    },

    domToMutation: function(xmlElement) {
      this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
      this.updateShape_();
    },

    decompose: function(workspace) {
      var containerBlock = workspace.newBlock('lists_create_with_container');
      containerBlock.initSvg();
      var connection = containerBlock.getInput('STACK').connection;
      for (var i = 0; i < this.itemCount_; i++) {
        var itemBlock = workspace.newBlock('lists_create_with_item');
        itemBlock.initSvg();
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
      }
      return containerBlock;
    },

    compose: function(containerBlock) {
      var itemBlock = containerBlock.getInputTargetBlock('STACK');
      var connections = [];
      while (itemBlock) {
        connections.push(itemBlock.valueConnection_);
        itemBlock = itemBlock.nextConnection &&
            itemBlock.nextConnection.targetBlock();
      }
      for (var i = 0; i < this.itemCount_; i++) {
        var connection = this.getInput('ADD' + i).connection.targetConnection;
        if (connection && connections.indexOf(connection) == -1) {
          connection.disconnect();
        }
      }
      this.itemCount_ = connections.length;
      this.updateShape_();
      for (var i = 0; i < this.itemCount_; i++) {
        Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
      }
    },
    saveConnections: function(containerBlock) {
      var itemBlock = containerBlock.getInputTargetBlock('STACK');
      var i = 0;
      while (itemBlock) {
        var input = this.getInput('ADD' + i);
        itemBlock.valueConnection_ = input && input.connection.targetConnection;
        i++;
        itemBlock = itemBlock.nextConnection &&
            itemBlock.nextConnection.targetBlock();
      }
    },
    updateShape_: function() {
      if (this.itemCount_ && this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
        this.appendValueInput('EMPTY')
     
        .appendField("XCheck")
        .appendField(new Blockly.FieldImage("https://abload.de/img/check23sjo4.png", 15, 15, { alt: "*", flipRtl: "FALSE" }));
        this.setNextStatement(true, "Check");
        this.setNextStatement(true, "Check");
      }
      for (var i = 0; i < this.itemCount_; i++) {
        if (!this.getInput('ADD' + i)) {
          var input = this.appendValueInput('ADD' + i)
              .setAlign(Blockly.ALIGN_RIGHT);
          if (i == 0) {

            input.appendField("XCheck")
            .appendField(new Blockly.FieldImage("https://abload.de/img/check23sjo4.png", 15, 15, { alt: "*", flipRtl: "FALSE" }));
          }
        }
      }
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
  };
  

  Blockly.Blocks['Attributechecktest'] = {
    init: function() {
        
      this.itemCount_ = 1;
      
      this.setInputsInline(false);
      
      this.updateShape_();

      this.setPreviousStatement(true, "Check");
      this.setNextStatement(true, "Check");
      this.setColour(100);
     
    
      this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
      this.setTooltip("hello");
    },

    mutationToDom: function() {
      var container = Blockly.utils.xml.createElement('mutation');
      container.setAttribute('items', this.itemCount_);
      return container;
    },

    domToMutation: function(xmlElement) {
      this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
      this.updateShape_();
    },

    decompose: function(workspace) {
      var containerBlock = workspace.newBlock('lists_create_with_container');
      containerBlock.initSvg();
      var connection = containerBlock.getInput('STACK').connection;
      for (var i = 0; i < this.itemCount_; i++) {
        var itemBlock = workspace.newBlock('lists_create_with_item');
        itemBlock.initSvg();
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
      }
      return containerBlock;
    },

    compose: function(containerBlock) {
      var itemBlock = containerBlock.getInputTargetBlock('STACK');

      var connections = [];
      while (itemBlock) {
        connections.push(itemBlock.valueConnection_);
        itemBlock = itemBlock.nextConnection &&
            itemBlock.nextConnection.targetBlock();
      }

      for (var i = 0; i < this.itemCount_; i++) {
        var connection = this.getInput('ADD' + i).connection.targetConnection;
        if (connection && connections.indexOf(connection) == -1) {
          connection.disconnect();
        }
      }
      this.itemCount_ = connections.length;
      this.updateShape_();

      for (var i = 0; i < this.itemCount_; i++) {
        Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
      }
    },

    saveConnections: function(containerBlock) {
      var itemBlock = containerBlock.getInputTargetBlock('STACK');
      var i = 0;
      while (itemBlock) {
        var input = this.getInput('ADD' + i);
        itemBlock.valueConnection_ = input && input.connection.targetConnection;
        i++;
        itemBlock = itemBlock.nextConnection &&
            itemBlock.nextConnection.targetBlock();
      }
    },

    updateShape_: function() {
      if (this.itemCount_ && this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
        this.appendValueInput('EMPTY')
     
        .appendField("ACheck")
        .appendField(new Blockly.FieldImage("https://abload.de/img/check23sjo4.png", 15, 15, { alt: "*", flipRtl: "FALSE" }));
        this.setNextStatement(true, "Check");
        this.setNextStatement(true, "Check");
      }

      for (var i = 0; i < this.itemCount_; i++) {
        if (!this.getInput('ADD' + i)) {
          var input = this.appendValueInput('ADD' + i)
              .setAlign(Blockly.ALIGN_RIGHT);
          if (i == 0) {

            input.appendField("ACheck")
            .appendField(new Blockly.FieldImage("https://abload.de/img/check23sjo4.png", 15, 15, { alt: "*", flipRtl: "FALSE" }));
          }
        }
      }

      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
  };


  Blockly.Blocks['Propertychecktest'] = {

    init: function() {
        
  
     
     
      this.itemCount_ = 1;
      
      this.setInputsInline(false);
      
      this.updateShape_();

      this.setPreviousStatement(true, "Check");
      this.setNextStatement(true, "Check");
      this.setColour(100);
     
    
      this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
      this.setTooltip("hello");
    },

    mutationToDom: function() {
      var container = Blockly.utils.xml.createElement('mutation');
      container.setAttribute('items', this.itemCount_);
      return container;
    },

    domToMutation: function(xmlElement) {
      this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
      this.updateShape_();
    },

    decompose: function(workspace) {
      var containerBlock = workspace.newBlock('lists_create_with_container');
      containerBlock.initSvg();
      var connection = containerBlock.getInput('STACK').connection;
      for (var i = 0; i < this.itemCount_; i++) {
        var itemBlock = workspace.newBlock('lists_create_with_item');
        itemBlock.initSvg();
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
      }
      return containerBlock;
    },

    compose: function(containerBlock) {
      var itemBlock = containerBlock.getInputTargetBlock('STACK');

      var connections = [];
      while (itemBlock) {
        connections.push(itemBlock.valueConnection_);
        itemBlock = itemBlock.nextConnection &&
            itemBlock.nextConnection.targetBlock();
      }
      for (var i = 0; i < this.itemCount_; i++) {
        var connection = this.getInput('ADD' + i).connection.targetConnection;
        if (connection && connections.indexOf(connection) == -1) {
          connection.disconnect();
        }
      }
      this.itemCount_ = connections.length;
      this.updateShape_();
      for (var i = 0; i < this.itemCount_; i++) {
        Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
      }
    },


    saveConnections: function(containerBlock) {
      var itemBlock = containerBlock.getInputTargetBlock('STACK');
      var i = 0;
      while (itemBlock) {
        var input = this.getInput('ADD' + i);
        itemBlock.valueConnection_ = input && input.connection.targetConnection;
        i++;
        itemBlock = itemBlock.nextConnection &&
            itemBlock.nextConnection.targetBlock();
      }
    },

    updateShape_: function() {
      if (this.itemCount_ && this.getInput('EMPTY')) {
        this.removeInput('EMPTY');
      } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
        this.appendValueInput('EMPTY')
     
        .appendField("PCheck")
        .appendField(new Blockly.FieldImage("https://abload.de/img/check23sjo4.png", 15, 15, { alt: "*", flipRtl: "FALSE" }));
        this.setNextStatement(true, "Check");
        this.setNextStatement(true, "Check");
      }
      for (var i = 0; i < this.itemCount_; i++) {
        if (!this.getInput('ADD' + i)) {
          var input = this.appendValueInput('ADD' + i)
              .setAlign(Blockly.ALIGN_RIGHT);
          if (i == 0) {

            input.appendField("PCheck")
            .appendField(new Blockly.FieldImage("https://abload.de/img/check23sjo4.png", 15, 15, { alt: "*", flipRtl: "FALSE" }));
          }
        }
      }
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
  };
  
