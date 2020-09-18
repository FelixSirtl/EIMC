
Blockly.JavaScript['importmodel'] = function(block) {
    var text_importquery = block.getFieldValue('Importquery');
    // TODO: Assemble JavaScript into code variable.


    var code = "ImportModel: " + text_importquery + ";\n";
    return code;
  };


  Blockly.JavaScript['applicability'] = function(block) {
    var statement_members = Blockly.JavaScript.statementToCode(block, 'NAME');
    var code = "\n Applicability;\n" + statement_members + "\n";
    return code;
  };


  Blockly.JavaScript['validation'] = function(block) {
    var statement_mem = Blockly.JavaScript.statementToCode(block, 'NAME');
    var code = "\n Validation;\n" + statement_mem + "\n";
    return code;
  };



  Blockly.JavaScript['property_filter'] = function(block) {
    var value_property_filter = Blockly.JavaScript.valueToCode(block, 'Property_Filter', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "PropertyFilter: " + value_property_filter + ";\n";
    return code;
  };


  Blockly.JavaScript['type_filter'] = function(block) {
    var type_filter = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "TypeFilter: " + type_filter + ";\n";
    return code;
  };

  Blockly.JavaScript['Projector'] = function(block) {
    var type_filter = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "Projector: " + type_filter + ";\n";
    return code;
  };

  Blockly.JavaScript['attribute_filter'] = function(block) {
    var type_filter = Blockly.JavaScript.valueToCode(block, 'attribute_Filter', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "AttributeFilter: " + type_filter + ";\n";
    return code;
  };
 
  
  Blockly.JavaScript['line'] = function(block) {
    var code = "Geometrieseparator;\n";
    return code;
  };


  Blockly.JavaScript['Test_identifier'] = function(block) {
    var testidentifier = block.getFieldValue('testdrop');
    // TODO: Assemble JavaScript into code variable.
    var code = "" + testidentifier + "";
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  Blockly.JavaScript['attribute_identifier'] = function(block) {
    var propsidentifier =  Blockly.JavaScript.valueToCode(block, 'own_entity', Blockly.JavaScript.ORDER_ATOMIC);
    var props = block.getFieldValue('Drop');
    // TODO: Assemble JavaScript into code variable.
    var code = '' + props + ' '+ propsidentifier + '';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };

  Blockly.JavaScript['property_identifier'] = function(block) {
    var propsidentifier =  Blockly.JavaScript.valueToCode(block, 'own_entity', Blockly.JavaScript.ORDER_ATOMIC);
    var props = block.getFieldValue('Drop');
    // TODO: Assemble JavaScript into code variable.
    var code = '' + props + ' '+ propsidentifier + '';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  Blockly.JavaScript['propertyset_identifier'] = function(block) {
    var propsidentifier =  Blockly.JavaScript.valueToCode(block, 'own_entity', Blockly.JavaScript.ORDER_ATOMIC);
    var props = block.getFieldValue('Drop');
    // TODO: Assemble JavaScript into code variable.
    var code = '' + props + ' '+ propsidentifier + '';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };


  Blockly.JavaScript['trueblocks'] = function(block) {
    var dropdowntrue = block.getFieldValue('trueblock');
    var code = '' + dropdowntrue + '';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };

  
  Blockly.JavaScript['Identifier'] = function(block) {
    var textT = block.getFieldValue('Tt');
    var code = '' + textT + '';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };



  Blockly.JavaScript['integernode'] = function(block) {
    var dropdown = block.getFieldValue('o');
    var code = ''+ dropdown + ';\n';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };



  Blockly.JavaScript['istgleich'] = function(block) {
    var test =  Blockly.JavaScript.valueToCode(block, 'ist', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown = block.getFieldValue('k');
    var code = '' + dropdown + ' ' + test + '';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };

  Blockly.JavaScript['integernodezwischennode'] = function(block) {
    var test =  Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown = block.getFieldValue('k');
    var code = '' + dropdown + " " + test + '';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };

  


  Blockly.JavaScript['xchecktest'] = function(block) {
  
    var Check = Blockly.JavaScript.valueToCode(block, 'EMPTY', Blockly.JavaScript.ORDER_ADDITION);
    var codeX = "";
    if(block.itemCount_)
    {
      var value_name;
      for(var i = 0; i <= block.itemCount_ -0; i++)
      {
        value_name = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_ATOMIC);
        codeX += value_name + '\n';
      }
      value_name = Blockly.JavaScript.valueToCode(block, 'ADD' + block.itemCount_, Blockly.JavaScript.ORDER_ATOMIC);
      codeX += value_name + "\n";
    }
  var code = "XCheck: " + Check + " " + codeX + ";\n";
    return code;
  };

  Blockly.JavaScript['Attributechecktest'] = function(block) {
  
    var Check = Blockly.JavaScript.valueToCode(block, 'EMPTY', Blockly.JavaScript.ORDER_ADDITION);
    var codeX = "";
    if(block.itemCount_)
    {
      var value_name;
      for(var i = 0; i <= block.itemCount_ -0; i++)
      {
        value_name = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_ATOMIC);
        codeX += value_name + "\n";
      }
      value_name = Blockly.JavaScript.valueToCode(block, 'ADD' + block.itemCount_, Blockly.JavaScript.ORDER_ATOMIC);
      codeX += value_name + "\n";
    }
  var code = "AttributeCheck: " + Check + " " + codeX + ";\n";
    return code;
  };

  Blockly.JavaScript['Propertychecktest'] = function(block) {
  
    var Check = Blockly.JavaScript.valueToCode(block, 'EMPTY', Blockly.JavaScript.ORDER_ADDITION);
    var codeX = "";
    if(block.itemCount_)
    {
      var value_name;
      for(var i = 0; i <= block.itemCount_ -0; i++)
      {
        value_name = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_ATOMIC);
        codeX += value_name + "\n";
      }
      value_name = Blockly.JavaScript.valueToCode(block, 'ADD' + block.itemCount_, Blockly.JavaScript.ORDER_ATOMIC);
      codeX += value_name + "\n";
    }
  var code = "PropertyCheck: " + Check + " " + codeX + ";\n";
    return code;
  };


  Blockly.JavaScript['Insidelist'] = function(block) {
  
    var Check = Blockly.JavaScript.valueToCode(block, 'EMPTY', Blockly.JavaScript.ORDER_ADDITION);
    var codeX = '';
    if(block.itemCount_)
    {
  
      var value_name;
  
      for(var i = 0; i <= block.itemCount_ -0; i++)
      {
  
        value_name = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_ATOMIC);
        codeX += value_name;
      }
      value_name = Blockly.JavaScript.valueToCode(block, 'ADD' + block.itemCount_, Blockly.JavaScript.ORDER_ATOMIC);
      codeX += value_name;
    }

  var code = "Inside: " + Check  + codeX + ";\n";
  
    return code;
  };

  
  Blockly.JavaScript['Touchoperator'] = function(block) {
  
    var Check = Blockly.JavaScript.valueToCode(block, 'EMPTY', Blockly.JavaScript.ORDER_ADDITION);
    var codeX = '';
    if(block.itemCount_)
    {
  
      var value_name;
  
      for(var i = 0; i <= block.itemCount_ -0; i++)
      {
  
        value_name = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_ATOMIC);
        codeX += value_name;
      }
      value_name = Blockly.JavaScript.valueToCode(block, 'ADD' + block.itemCount_, Blockly.JavaScript.ORDER_ATOMIC);
      codeX += value_name;
    }

  var code = "Inside: " + Check  + codeX + ";\n";
  
    return code;
  };

  Blockly.JavaScript['exportmodel'] = function(block) {
    var text_download = block.getFieldValue('Download');
    var code = 'ExportModel:'+ ' ' + text_download + ';\n';
    return code;
  };