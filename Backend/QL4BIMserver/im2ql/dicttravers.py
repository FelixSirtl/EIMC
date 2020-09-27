import json
from qlbuilder import qlbuilder, vari_hierachie

vari_hier = vari_hierachie()

def nodes_to_list1(d):
    def iter1(d, keys, level, parent):

        if isinstance(d, dict):
            for k, v in d.items():
                keys.append(("-"*level+" ") + k +  " parent: " + parent)
                iter1(v, keys, level + 1, k)

        elif isinstance(d, list):
            for i, v in enumerate(d):
                keys.append(("-"*level+" ") + str(i) +  " parent: " + parent)
                iter1(v, keys, level + 1, parent)

        else:
            keys.append(("-"*level+" ") + str(d) +  " parent: " + parent)

        return keys

    return iter1(d, [], 0, "None")


def nodes_traversal(d, querybuild):

    def iter1(d, parent, pathstack, key, index, querybuild):
        process_node(d, parent, pathstack, key, index, querybuild)

        if isinstance(d, dict):
            for k, v in d.items():
                local_pstack = list(pathstack)
                local_pstack.append("k_" + str(k))
                iter1(v, d, local_pstack, k, None, querybuild)
                process_node_post(v, d, local_pstack, k, None, querybuild)

        elif isinstance(d, list):
            for i, v in enumerate(d):
                local_pstack = list(pathstack)
                local_pstack.append("i_" + str(i))
                iter1(v, parent, local_pstack, None, i, querybuild)
                process_node_post(v, parent, local_pstack, None, i, querybuild)
        else:
            local_pstack = list(pathstack)
            local_pstack.append("v_" + str(d))
            process_value(d, parent, querybuild)


    iter1(d, None, [], None, None, querybuild)


def process_value(d, parent, querybuilder: qlbuilder):
    if d == "Geometrieseparator":
        querybuilder.set_geoopt()


def process_node(d, parent, stack, key, index, querybuilder: qlbuilder):

    if key == "ImportModel":
        querybuilder.addImportModelOpt(d)

    if key == "TypeFilter":
        querybuilder.addTypeFilterOpt( d)

    if key == "PropertyFilter":
        pred_parts = predicate_splitter(d)
        querybuilder.addPropFilterOpt(pred_parts[0], pred_parts[-1])

    if key == "AttributeFilter":
        pred_parts = predicate_splitter(d)
        querybuilder.addAttFilterOpt(pred_parts[0], pred_parts[-1])

    if key == "Touch":
        querybuilder.addTouchOpt(d)

    if key == "XCheck":
        pred_parts = predicate_splitter(d)

        #with index or without
        if len(pred_parts) == 3:
            querybuilder.addXCheckOpt(pred_parts[0], pred_parts[-1])
        elif len(pred_parts) == 4: #with index
            querybuilder.addXCheckOpt(pred_parts[0], pred_parts[-2], pred_parts[-1])
        querybuilder.increase_validation_index()



def process_node_post(d, parent, stack, key, index, querybuilder: qlbuilder):
    if key == "Applicability":
        querybuilder.set_appstart()


def predicate_splitter(pred):
    parts = pred.split()
    if len(parts) == 2:
        parts.insert(1, "=")

    last = parts[-1]

    last_parts = None
    if ";" in last:
        last_parts = last.split(";")
        parts.pop()
        parts.extend(last_parts)

    return parts

