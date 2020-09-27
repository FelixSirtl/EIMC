import json 
from dicttravers import nodes_to_list1, nodes_traversal
from qlbuilder import qlbuilder, vari_hierachie


def test_dict_traversal_1():
    mvdj_dict = None
    with open("intermediatecode_1.json") as json_file:
        mvdj_dict = json.load(json_file)
    
    querybuilder = qlbuilder(vari_hierachie())
    nodes_traversal(mvdj_dict, querybuilder)
    
    query_text = "\n".join(querybuilder.statements)
    
    i = 0

def test_dict_traversal_2():
    mvdj_dict = None
    with open("intermediatecode_2.json") as json_file:
        mvdj_dict = json.load(json_file)
    

    querybuilder = qlbuilder(vari_hierachie())
    nodes_traversal(mvdj_dict, querybuilder)
    
    query_text = "\n".join(querybuilder.statements)
    
    assert query_text == 'set1 = ImportModel(C:\\Users\\enter_own_path.ifc)\nset2 = TypeFilter(set1 is IfcWindow)\nset3 = TypeFilter(set2 is IfcX)\nset4 = TypeFilter(set1 is IfcWall)\nset5 = PropertyFilter(set4.LoadBearing = true)\nset6 = XCheck(set3.ThermalTrancemittance = 12)\nset7 = XCheck(set5.ThermalTrancemittance = 12)'



def test_dict_traversal_3():
    mvdj_dict = None
    with open("intermediatecode_3.json") as json_file:
        mvdj_dict = json.load(json_file)
    

    querybuilder = qlbuilder(vari_hierachie())
    nodes_traversal(mvdj_dict, querybuilder)
    
    query_text = "\n".join(querybuilder.statements)

    with open("query_text.txt", "w") as text_file:
        text_file.write(query_text)

    assert query_text == 'set1 = ImportModel(C:\\Users\\enter_own_path.ifc)\nset2 = TypeFilter(set1 is IfcWindow)\nset3 = TypeFilter(set1 is IfcWall)\nset4 = PropertyFilter(set3.LoadBearing = true)\nset5 = TypeFilter(set1 is IfcWindow)\nrel6[] = Touch(set5, set4)\nrel7[] = XCheck(set2.ThermalTrancemittance = 1.3)\nrel8[] = XCheck(rel6, [0].ThermalTrancemittance = 1.3)\nrel9[] = XCheck(rel6, [1].ThermalTrancemittance = 1.3)'


def test_dict_traversal_4():
    mvdj_dict = None
    with open("intermediatecode_4.json") as json_file:
        mvdj_dict = json.load(json_file)
    

    querybuilder = qlbuilder(vari_hierachie())
    nodes_traversal(mvdj_dict, querybuilder)
    
    query_text = "\n".join(querybuilder.statements)

    with open("query_text.txt", "w") as text_file:
        text_file.write(query_text)

    assert query_text == 'set1 = ImportModel(C:\\Users\\enter_own_path.ifc)\nset2 = TypeFilter(set1 is IfcWindow)\nset3 = TypeFilter(set1 is IfcWall)\nset4 = PropertyFilter(set3.LoadBearing = true)\nset5 = TypeFilter(set1 is IfcWindow)\nrel6[] = Touch(set5, set4)\nrel7[] = XCheck(set2.ThermalTrancemittance = 1.3)\nrel8[] = XCheck(rel6, [0].ThermalTrancemittance = 1.3)\nrel9[] = XCheck(rel6, [1].ThermalTrancemittance = 1.3)'
