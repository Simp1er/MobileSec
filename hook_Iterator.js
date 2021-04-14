function IterateSet(env,hasMapObj){
    var MapClazz = env.findClass('java/util/HashMap')
    if(env.isInstanceOf(hasMapObj,MapClazz)){
        // HashMap.get(Object)
        var GetMID = env.getMethodId(MapClazz,'get','(Ljava/lang/Object;)Ljava/lang/Object;')
        var InvokeGet = env.vaMethod('pointer',['pointer'])
        var keySetMID = env.getMethodId(MapClazz,'keySet','()Ljava/util/Set;')
        var InvokeKeySet = env.vaMethod('pointer',[])
        var setObj = InvokeKeySet(env.handle,retval,keySetMID)

        var SetClazz =  env.findClass('java/util/Set')
        if(env.isInstanceOf(setObj,SetClazz)){
            var iteratorMID = env.getMethodId(SetClazz,'iterator','()Ljava/util/Iterator;')
            var Invokeiterator = env.vaMethod('pointer',[])
            var IterObj = Invokeiterator(env.handle,setObj,iteratorMID)
            var IteratorClazz = env.findClass('java/util/Iterator')
            if(env.isInstanceOf(IterObj,IteratorClazz)){
                var hasNextMID = env.getMethodId(IteratorClazz,'hasNext','()Z')
                var InvokehasNext = env.vaMethod('uint8',[])
                var nextMID = env.getMethodId(IteratorClazz,'next','()Ljava/lang/Object;')
                var InvokeNext = env.vaMethod('pointer',[])
                while(InvokehasNext(env.handle,IterObj,hasNextMID)){
                    var keyObj = InvokeNext(env.handle,IterObj,nextMID)
                    var key = env.getStringUtfChars(keyObj).readCString()
                    
                    var valueObj  = InvokeGet(env.handle,retval,GetMID,keyObj)
                    var value = env.getStringUtfChars(valueObj).readCString()
                    console.log(key,'=>',value)
                }
            }
        }
        
    }  
}
/*
xxx => azU7Bc002xAAJ9QEYW1mGJrO8f0Ed9QH0FqzYdOlL8/Md/QHpENnwiLJhCBZB5mhQtIXdU8Pnw43BRB7hD6QY3VDdZfUF9QH1BfUB9
bbbb => HHnB_FCRa80QdwWegx+jn98jVfguVXqGwR3kh9ROtBHavXaYZV+qLX+lUnG4LVQfyqsJ/zFo0JH2gRVVSi98GPkuj9GWADR18oS+VyJ2XhLUQYev/wQDCMFWSAYaGABE2SOBT
cccc => JAE5zHBA7W55NB1VcTLaT8wI/An8Ae8A+wn5Gvsa7wj6CPQN/Qv6CPg=
dddd => hwIABwRLPF9s5QJ40ATaaW1cNymwhLCe
*/

