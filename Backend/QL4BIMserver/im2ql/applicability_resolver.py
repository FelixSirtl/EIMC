def appstoapp(d: dict):
    importModel = d["ImportModel"]
    validation =d["Validation"]

    list_of_ds = []
    for app in d["Applicabilities"]:
        d = {"ImportModel": importModel, "Applicability":app, "Validation": validation}
        list_of_ds.append(d)

    return list_of_ds