import sys
import json 
from dicttravers import nodes_to_list1, nodes_traversal
from qlbuilder import qlbuilder, vari_hierachie

qim_text = sys.argv[1]
qim_text = qim_text.replace("$", "\"")

with open("Output.txt", "w") as text_file:
    print(qim_text, file=text_file)

querybuilder = qlbuilder(vari_hierachie())


qim_dict = json.loads(qim_text)
nodes_traversal(qim_dict, querybuilder)

query_text = "\n".join(querybuilder.statements)
print(query_text)