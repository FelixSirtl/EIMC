from string import Template
import copy

IMPORT_SET_OPT_= Template('$outval = ImportModel($value)')

ATTFILTER_SET_OPT = Template('$outval = AttributeFilter($inset.$attribute = $value)')
ATTFILTER_REL_OPT = Template('$outval = AttributeFilter($inrel, [$index].$attribute = $value)')

PROPFILTER_SET_OPT = Template('$outval = PropertyFilter($inset.$attribute = $value)')
PROPFILTER_REL_OPT = Template('$outval = PropertyFilter($inrel, [$index].$attribute = $value)')

TYPE_SET_OPT = Template('$outval = TypeFilter($inset is $type)')
TYPE_REL_OPT = Template('$outval = TypeFilter($inrel, [$index] is $type)')

DEREF_SET_OPT = Template('$outval = Dereferencer($inset.$attribute)')
DEREF_REL_OPT = Template('$outval = Dereferencer($inrel, [$index].$attribute)')

XCHECK_SET_OPT = Template('$outval = XCheck($inset.$attribute = $value)')
XCHECK_REL_OPT = Template('$outval = XCheck($inrel, [$index].$attribute = $value)')

TOUCH_SET_OPT = Template('$outval = Touch($inset1, $inset2)')
#TOUCH_REL_OPT = Template('$outval = Touch($inrel, [$index].$attribute = $value)')

RELNAME ="rel"
SETNAME = "set"

class vari_hierachie:
    def __init__(self):
        self.import_vari = None
        self.geoop_vari = None
        self.app_last_varis = []
        self.last_instanciated = None
        self.application_index = 0


class rel_col:
    def __init__(self, index):
        self.index = index


class qlbuilder:

    def __init__(self, vari_hierachie):
        self.vari_hierachie = vari_hierachie
        self.statements = []
        self.index = 0
        self.appstart = False
        self.geoop = False
    

    def next_index(self):
        self.index +=1
        return self.index


    def set_geoopt(self):
        self.vari_hierachie.geoop_vari = self.vari_hierachie.last_instanciated
        self.geoop = True


    def set_appstart(self):
        self.appstart = True
        self.vari_hierachie.app_last_varis.append(self.vari_hierachie.last_instanciated)
        #self.vari_hierachie.last_instanciated = self.vari_hierachie.import_vari

    def increase_validation_index(self):
        self.vari_hierachie.application_index =+1


    def opt_init(self):
        current_var = self.vari_hierachie.last_instanciated
        if self.appstart:
            current_var = self.vari_hierachie.import_vari
            self.appstart = False

        if self.geoop:
            current_var = self.vari_hierachie.import_vari
            self.geoop = False

        return current_var


    def addImportModelOpt(self, value):

        self.vari_hierachie.last_instanciated = self.get_variable("set")
        self.vari_hierachie.import_vari = self.vari_hierachie.last_instanciated

        subst = IMPORT_SET_OPT_.substitute(outval = self.vari_hierachie.last_instanciated, value=value)
        self.statements.append(subst)


    def addTypeFilterOpt(self, _type, index=None):
        current_var = self.opt_init()

        next_vari = self.next_variable()
        subst = None
        if(isinstance(current_var, self.set)):
            subst = TYPE_SET_OPT.substitute(outval=self.vari2outval(next_vari), inset=str(current_var), type=_type)
        elif (isinstance(current_var, self.relation)):
            subst = TYPE_REL_OPT.substitute(outval=self.vari2outval(next_vari), inrel=str(current_var),  index="-1", type=_type)
        self.statements.append(subst)
            
    
    def addAttFilterOpt(self, attribute, value, index=None):
        current_var = self.opt_init()

        next_vari = self.next_variable()
        subst = None
        if(isinstance(current_var, self.set)):
            subst = ATTFILTER_SET_OPT.substitute(outval=self.vari2outval(next_vari), inset=str(current_var), attribute=attribute, value=value)
        elif (isinstance(current_var, self.relation)):
            subst = ATTFILTER_REL_OPT.substitute(outval=self.vari2outval(next_vari), inrel=str(current_var),  index="-1", attribute=attribute, value=value)
        self.statements.append(subst)

    
    def addPropFilterOpt(self, attribute, value, index=None):  
        current_var = self.opt_init()

        next_vari = self.next_variable()
        subst = None
        if(isinstance(current_var, self.set)):
            subst = PROPFILTER_SET_OPT.substitute(outval=self.vari2outval(next_vari), inset=str(current_var), attribute=attribute, value=value)
        elif (isinstance(current_var, self.relation)):
            subst = PROPFILTER_SET_OPT.substitute(outval=self.vari2outval(next_vari), inrel=str(current_var),  index="-1", attribute=attribute, value=value)
        self.statements.append(subst)
    

    def addTouchOpt(self, index=None):  
        current_var = self.opt_init()

        next_vari = self.next_variable(1)
        #todo rel,set check of varis
        subst = TOUCH_SET_OPT.substitute(outval=self.vari2outval(next_vari), inset1=str(current_var), inset2=str(self.vari_hierachie.geoop_vari))
        self.vari_hierachie.geoop_vari = None
        self.statements.append(subst)


    def addXCheckOpt(self, attribute, value, index=None):

        # if no index is present take all last varies, if present then add this to list
        last_varis = self.vari_hierachie.app_last_varis

        if index is not None: #new list with only that entry
            last_varis = [last_varis[int(index)-1]]

        #do it for all last varis of the applicablities
        for last_app_vari in last_varis:

            # check if the vari is a set or a relation
            if(isinstance(last_app_vari, self.set)):

                #do simple set check
                self.addXCheckOpt_local(last_app_vari, attribute, value)

            elif (isinstance(last_app_vari, self.relation)):

                #do check for each column of relation
                columns_count = last_app_vari.get_relatts_count()
                for i in range(columns_count):
                    self.addXCheckOpt_local(last_app_vari, attribute, value, i)


    def addXCheckOpt_local(self, vari_in, attribute, value, index=None):
        next_vari = self.next_variable()
        subst = None
        if(isinstance(vari_in, self.set)):
            subst = XCHECK_SET_OPT.substitute(outval=self.vari2outval(next_vari), inset=str(vari_in), attribute=attribute, value=value)
        elif (isinstance(vari_in, self.relation)):
            subst = XCHECK_REL_OPT.substitute(outval=self.vari2outval(next_vari), inrel=str(vari_in),  index=str(index), attribute=attribute, value=value)
        self.statements.append(subst)


    def vari2outval(self, vari):
        if(isinstance(vari, self.set)):
            return str(vari)
        elif (isinstance(vari, self.relation)):
            return str(vari)+"[]"
        else:
            raise Exception("variable not set or relation")


    # creates a new vaiable from an old one by increasing the index
    # sets will be tranferred to rels if add > 0
    # rels columns will be increased by add 
    def next_variable(self, add=0):
        variable = self.vari_hierachie.last_instanciated
        copied = None
        if isinstance(variable, qlbuilder.set) and (add > 0):
            copied = qlbuilder.relation(self.next_index(), 1 + add)
        else:
            copied = copy.copy(variable)
            if isinstance(variable, qlbuilder.relation):
                copied.relatts_count += add
            copied.index = self.next_index()

        self.vari_hierachie.last_instanciated = copied
        return copied
    

    class relation:
        def __init__(self, index, relatts_count):
            self.index = index
            self.relatts_count = relatts_count
            
        def get_relatts_count(self):
            return self.relatts_count 
        
        def __str__(self):
            return RELNAME + str(self.index)


    class set:
        def __init__(self, index):
            self.index = index
        
        def __str__(self):
            return SETNAME + str(self.index)

        def __repr__(self):
            self.__str__()

    # gets a new set or rel variable with increased index
    # for rel defaults to cardinality 2, or via relatts_count
    def get_variable(self, vtype: str, relatts_count=None):
        if(vtype == "relation"):
            rel_count = 2 if relatts_count == None else relatts_count
            return qlbuilder.relation(self.next_index(), rel_count)
        elif(vtype == "set"):
            return qlbuilder.set(self.next_index())
            
