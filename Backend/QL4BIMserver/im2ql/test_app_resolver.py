
import json
from applicability_resolver import appstoapp

def test_dict_appstoapp():
    mvdj_dict = None
    with open("intermediatecode_1.json") as json_file:
        mvdj_dict = json.load(json_file)
    
    mvdj_dict_apps = appstoapp(mvdj_dict)
    assert len(mvdj_dict_apps) == 2