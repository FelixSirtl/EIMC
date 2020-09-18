var toolbox= document.getElementById('toolbox');

Blockly.inject('blocklyDiv', 
					{'toolbox': toolbox,
				     zoom:
				         {controls: true,
				          wheel: true,
				          startScale: 1.0,
				          maxScale: 3,
				          minScale: 0.3,
				          scaleSpeed: 1.2},
				     trashcan: true
     				});