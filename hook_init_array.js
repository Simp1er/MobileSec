function hook_init_array() {
    //console.log("hook_constructor",Process.pointerSize);
    if (Process.pointerSize == 4) {
        var linker = Process.findModuleByName("linker");
    }else if (Process.pointerSize == 8) {
        var linker = Process.findModuleByName("linker64");

    }

    
    var addr_call_array = null;
    if (linker) {
        var symbols = linker.enumerateSymbols();
        for (var i = 0; i < symbols.length; i++) {
            var name = symbols[i].name;
            if (name.indexOf("call_array") >= 0) {
                addr_call_array = symbols[i].address;
            }
        }
    }
    if (addr_call_array) {
        Interceptor.attach(addr_call_array, {
            onEnter: function (args) {

                this.type = ptr(args[0]).readCString();
                //console.log(this.type,args[1],args[2],args[3])
                if (this.type == "DT_INIT_ARRAY") {
                    this.count = args[2];
                    //this.addrArray = new Array(this.count);
                    this.path = ptr(args[3]).readCString();
                    var strs = new Array(); //定义一数组 
                    strs = this.path.split("/"); //字符分割
                    this.filename = strs.pop();
                    if(this.count > 0){
                        console.log("path : ", this.path);
                        console.log("filename : ", this.filename);
                    }
                    for (var i = 0; i < this.count; i++) {
                        console.log("offset : init_array["+i+"] = ", ptr(args[1]).add(Process.pointerSize*i).readPointer().sub(Module.findBaseAddress(this.filename)));
                        //插入hook init_array代码
                    }
                }
            },
            onLeave: function (retval) {

            }
        });
    }
}

function main() {
    if (Java.androidVersion == "8.1.0") {
        hook_init_array();
    }

}


setImmediate(main);