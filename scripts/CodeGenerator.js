
Blockly.JavaScript['importmodel'] = function(block) {
    var text_importquery = block.getFieldValue('Importquery');

    var code = "\"ImportModel\":" + text_importquery.replace(/\\/gi, "\\\\") + ",\n";
    code = code + "\"Applicabilities\":[\n"
    return code;
  };


  Blockly.JavaScript['applicability'] = function(block) {
    var statement_members = Blockly.JavaScript.statementToCode(block, 'NAME');
    var code = "\t{\"Applicability\":\n[" + statement_members + "]},\n";
    return code;
  };


  Blockly.JavaScript['validation'] = function(block) {
    var statement_mem = Blockly.JavaScript.statementToCode(block, 'NAME');
    var code = "],\n\"Validation\":[\n" + statement_mem + "]\n";
    return code;
  };



  Blockly.JavaScript['property_filter'] = function(block) {
    var value_property_filter = Blockly.JavaScript.valueToCode(block, 'Property_Filter', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "\t\t{\"PropertyFilter\":\"" + value_property_filter + "\"},\n";
    return code;
  };


  Blockly.JavaScript['type_filter'] = function(block) {
    var type_filter = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "\t\t{\"TypeFilter\":\"" + type_filter + "\"},\n";
    return code;
  };

  Blockly.JavaScript['Projector'] = function(block) {
    var type_filter = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "\t\t{\"Projector:\"" + type_filter + "},\n";
    return code;
  };

  Blockly.JavaScript['attribute_filter'] = function(block) {
    var type_filter = Blockly.JavaScript.valueToCode(block, 'attribute_Filter', Blockly.JavaScript.ORDER_ATOMIC);
    var code = "\t\t\{\"AttributeFilter:\"" + type_filter + "},\n";
    return code;
  };
 
  
  Blockly.JavaScript['line'] = function(block) {
    var code = "Geometrieseparator;\n";
    return code;
  };


  Blockly.JavaScript['Test_identifier'] = function(block) {
    var testidentifier = block.getFieldValue('testdrop');
    var code = "" + testidentifier + "";
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  Blockly.JavaScript['attribute_identifier'] = function(block) {
    var propsidentifier =  Blockly.JavaScript.valueToCode(block, 'own_entity', Blockly.JavaScript.ORDER_ATOMIC);
    var props = block.getFieldValue('Drop');
    var code = '' + props + ' '+ propsidentifier + '';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };

  Blockly.JavaScript['property_identifier'] = function(block) {
    var propsidentifier =  Blockly.JavaScript.valueToCode(block, 'own_entity', Blockly.JavaScript.ORDER_ATOMIC);
    var props = block.getFieldValue('Drop');
    var code = '' + props + ' '+ propsidentifier + '';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  Blockly.JavaScript['propertyset_identifier'] = function(block) {
    var propsidentifier =  Blockly.JavaScript.valueToCode(block, 'own_entity', Blockly.JavaScript.ORDER_ATOMIC);
    var props = block.getFieldValue('Drop');
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
    var code = ''+ dropdown + '';
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
  
    var EmptyXCheck = Blockly.JavaScript.valueToCode(block, 'EMPTY', Blockly.JavaScript.ORDER_ADDITION);
    var codeX = "";
    if(block.itemCount_)
    {
      var valueX;
      for(var i = 0; i <= block.itemCount_ -0; i++)
      {
        valueX = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_ATOMIC);
        codeX += valueX ;
      }
      valueX = Blockly.JavaScript.valueToCode(block, 'ADD' + block.itemCount_, Blockly.JavaScript.ORDER_ATOMIC);
      codeX += valueX;
    }
  var code = "\t\{\"XCheck\":\"" + EmptyXCheck + codeX + "\"},\n";
    return code;
  };

  Blockly.JavaScript['Attributechecktest'] = function(block) {
  
    var CheckAEmpty = Blockly.JavaScript.valueToCode(block, 'EMPTY', Blockly.JavaScript.ORDER_ADDITION);
    var codeX = "";
    if(block.itemCount_)
    {
      var valueA;
      for(var i = 0; i <= block.itemCount_ -0; i++)
      {
        valueA = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_ATOMIC);
        codeX += valueA + "\n";
      }
      valueA = Blockly.JavaScript.valueToCode(block, 'ADD' + block.itemCount_, Blockly.JavaScript.ORDER_ATOMIC);
      codeX += valueA;
    }
  var code = "\"AttributeCheck\": " + CheckAEmpty + " " + codeX + ";\n";
    return code;
  };

  Blockly.JavaScript['Propertychecktest'] = function(block) {
  
    var CheckPEmpty = Blockly.JavaScript.valueToCode(block, 'EMPTY', Blockly.JavaScript.ORDER_ADDITION);
    var codeX = "";
    if(block.itemCount_)
    {
      var valueP;
      for(var i = 0; i <= block.itemCount_ -0; i++)
      {
        valueP = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_ATOMIC);
        codeX += valueP+ "\n";
      }
      valueP = Blockly.JavaScript.valueToCode(block, 'ADD' + block.itemCount_, Blockly.JavaScript.ORDER_ATOMIC);
      codeX += valueP;
    }
  var code = "\"PropertyCheck:\" " + CheckPEmpty + " " + codeX + ";\n";
    return code;
  };


  Blockly.JavaScript['Insidelist'] = function(block) {
  
    var EmptyInside = Blockly.JavaScript.valueToCode(block, 'EMPTY', Blockly.JavaScript.ORDER_ADDITION) + "";
    var codeX = '';
    if(block.itemCount_)
    {
      var valueI;
      for(var i = 0; i <= block.itemCount_ +0; i++)
      {
  
        valueI = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_ATOMIC);
        codeX += valueI + "\n";
      }
      valueI = Blockly.JavaScript.valueToCode(block, 'ADD' + block.itemCount_, Blockly.JavaScript.ORDER_ATOMIC);
      codeX += valueI;
    }

    var code = "Inside: " + EmptyInside  + codeX + ";\n";
    return code;
  };

  Blockly.JavaScript['Touchoperator'] = function(block) {
    var EmptyTouch = Blockly.JavaScript.valueToCode(block, 'EMPTY', Blockly.JavaScript.ORDER_ADDITION);
    var codeX = '';
    if(block.itemCount_)
    {
      var valueT;
      for(var i = 0; i <= block.itemCount_ -0; i++)
      {
        valueT = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_ATOMIC);
        codeX += valueT + "\n";
      }
      valueT = Blockly.JavaScript.valueToCode(block, 'ADD' + block.itemCount_, Blockly.JavaScript.ORDER_ATOMIC);
      codeX += valueT;
    }
  var code = "Touch: " + EmptyTouch  + codeX + ";\n";
    return code;
  };

  Blockly.JavaScript['exportmodel'] = function(block) {
    var text_download = block.getFieldValue('Download');
    var code = 'ExportModel:'+ ' ' + text_download + ';\n';
    return code;
  };
