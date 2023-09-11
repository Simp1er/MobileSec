// https://www.romainthomas.fr/post/21-07-pokemongo-anti-frida-jailbreak-bypass/
function hook_mod_init_func(addr,targetModule){
    Interceptor.attach(addr,{
        onEnter: function(){
            var debugSymbol = DebugSymbol.fromAddress(this.context.x1)
            if(debugSymbol.moduleName == targetModule){
                Interceptor.attach(debugSymbol.address,{
                    onEnter: function(){
                        // hook_msHookFunction()
                    },
                    onLeave: function(){
                         
                    }
                })
 
            }
             
        },onLeave: function(){
 
        }
    })
}
function findSymbolsAndHook(targetModule){
    // frida hook dyld
    let dyld =  Process.getModuleByName('dyld');
    if(dyld){
        let symbols = dyld.enumerateSymbols()
        if(symbols){
            symbols.forEach((symbol) => {
                if (symbol.name.indexOf('ImageLoader') >= 0 && symbol.name.indexOf('containsAddress') >= 0){
                    console.log(`symbol name  = ${symbol.name}`)
                    hook_mod_init_func(symbol.address,targetModule)
                }
            })
        }
         
    }
 
}
function main(){
    findSymbolsAndHook("test") // test 替换为自己想要hook的模块名即可。
}
setImmediate(main)