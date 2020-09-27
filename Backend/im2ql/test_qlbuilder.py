from qlbuilder import qlbuilder


def test_qlbuilder_sets_rels():
    qlb = qlbuilder()
    set_a = qlb.get_variable("set")
    assert str(set_a) == "set1"

    set_b = qlb.get_variable("set")
    assert str(set_b) == "set2"

    rel_a = qlb.get_variable("relation")
    assert str(rel_a) == "rel3"
    assert rel_a.get_relatts_count() == 2

    rel_b = qlb.get_variable("relation", 8)
    assert str(rel_b) == "rel4"
    assert rel_b.get_relatts_count() == 8


def test_qlbuilder_next_variable():
    qlb = qlbuilder()
    set_a = qlb.get_variable("set")

    set_b = qlb.next_variable(set_a)
    assert str(set_b) == "set2" 
    assert isinstance(set_b, qlbuilder.set)

    rel_a = qlb.next_variable(set_a, 1)
    assert str(rel_a) == "rel3"
    assert rel_a.get_relatts_count() == 2
    assert isinstance(rel_a, qlbuilder.relation)

    rel_b = qlb.next_variable(rel_a)
    assert str(rel_b) == "rel4"
    assert rel_a.get_relatts_count() == 2
    assert isinstance(rel_b, qlbuilder.relation)

    rel_c = qlb.next_variable(rel_b, 3)
    assert str(rel_c) == "rel5"
    assert rel_c.get_relatts_count() == 5
    assert isinstance(rel_c, qlbuilder.relation)


def test_qlbuilder_addAttStatement():
    qlb = qlbuilder()
    qlb.current_var = qlb.get_variable("set")
    qlb.addDerefOpt("att1")

    derefOpt1 = qlb.statements[0]
    assert derefOpt1 == "rel2[] = Dereferencer(set1.att1)"


def test_qlbuilder_addImportModel():
    qlb = qlbuilder()
    qlb.addImportModelOpt("file/path")

    opt1 = qlb.statements[0]
    assert opt1 == "set1 = ImportModel(file/path)"

    qlb.addDerefOpt("att1")
    opt2 = qlb.statements[1]
    assert opt2 == "rel2[] = Dereferencer(set1.att1)"


def test_qlbuilder_addTypeFilter():
    qlb = qlbuilder()
    qlb.addImportModelOpt("file/path")

    opt1 = qlb.statements[0]
    assert opt1 == "set1 = ImportModel(file/path)"

    qlb.addTypeFilterOpt("IfcWall")
    opt2 = qlb.statements[1]
    assert opt2 == "set2 = TypeFilter(set1 is IfcWall)"