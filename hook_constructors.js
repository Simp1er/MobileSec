function hook_constructor() {
    if (Process.pointerSize == 4) {
        var linker = Process.findModuleByName("linker");
    } else {
        var linker = Process.findModuleByName("linker64");
    }

    var addr_call_function =null;
    var addr_g_ld_debug_verbosity = null;
    var addr_async_safe_format_log = null;
    if (linker) {
        var symbols = linker.enumerateSymbols();
        for (var i = 0; i < symbols.length; i++) {
            var name = symbols[i].name;
            if (name.indexOf("call_function") >= 0){
                addr_call_function = symbols[i].address;
            }
            else if(name.indexOf("g_ld_debug_verbosity") >=0){
                addr_g_ld_debug_verbosity = symbols[i].address;
              
                ptr(addr_g_ld_debug_verbosity).writeInt(2);

            } else if(name.indexOf("async_safe_format_log") >=0 && name.indexOf('va_list') < 0){
            
                addr_async_safe_format_log = symbols[i].address;

            } 

        }
    }
    if(addr_async_safe_format_log){
        Interceptor.attach(addr_async_safe_format_log,{
            onEnter: function(args){
                this.log_level  = args[0];
                this.tag = ptr(args[1]).readCString()
                this.fmt = ptr(args[2]).readCString()
                if(this.fmt.indexOf("c-tor") >= 0 && this.fmt.indexOf('Done') < 0){
                    this.function_type = ptr(args[3]).readCString(), // func_type
                    this.so_path = ptr(args[5]).readCString();
                    var strs = new Array(); //定义一数组 
                    strs = this.so_path.split("/"); //字符分割
                    this.so_name = strs.pop();
                    this.func_offset  = ptr(args[4]).sub(Module.findBaseAddress(this.so_name)) 
                     console.log("func_type:", this.function_type,
                        '\nso_name:',this.so_name,
                        '\nso_path:',this.so_path,
                        '\nfunc_offset:',this.func_offset 
                     );
                }
            },
            onLeave: function(retval){

            }
        })
    }
}
function main() {
    hook_constructor();
}
setImmediate(main);