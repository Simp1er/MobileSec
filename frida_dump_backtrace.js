/**
 * 
refer:  
private static void dump() {
        for (Map.Entry<Thread, StackTraceElement[]> stackTrace : Thread.getAllStackTraces().entrySet()) {
            Thread thread = (Thread) stackTrace.getKey();
            StackTraceElement[] stack = (StackTraceElement[]) stackTrace.getValue();
            // 进行过滤
            if (thread.equals(Thread.currentThread())) {
                continue;
            }
            XposedBridge.log("[Dump Stack]" + "**********线程名字：" + thread.getName() + "**********");
            int index = 0;
            for (StackTraceElement stackTraceElement : stack) {
                XposedBridge.log("[Dump Stack]" + index + ": " + stackTraceElement.getClassName()
                        + "----" + stackTraceElement.getFileName()
                        + "----" + stackTraceElement.getLineNumber()
                        + "----" + stackTraceElement.getMethodName());
            }
            // 增加序列号
            index++;
        }
        XposedBridge.log("[Dump Stack]" + "********************* over **********************");
    }
 */
function dumpMutiBackTrace() {
    Java.perform(function () {
        var Thread = Java.use('java.lang.Thread');
        var thread_stack_map = Thread.getAllStackTraces();
        const mapClass = Java.use("java.util.Map");
        const entryClass = Java.use("java.util.Map$Entry");

        const entrySet = mapClass.entrySet.apply(thread_stack_map).iterator();
        while (entrySet.hasNext()) {
            const entry = Java.cast(entrySet.next(), entryClass);
            const thread = Java.cast(entry.getKey(), Thread);


            const StackTraceElements = entry.getValue();

            // refer:  https://bbs.pediy.com/thread-268335.htm
            var ArrayClz = Java.use("java.lang.reflect.Array");
            var len = ArrayClz.getLength(StackTraceElements);
            if (len > 0) {
                console.log("\n[Dump Stack]=============================" + thread.getName() + " Stack start=======================");
                for (let i = 0; i < len; i++) {
                    console.log("\t" + Java.cast(ArrayClz.get(StackTraceElements, i), Java.use('java.lang.StackTraceElement')));
                }
                console.log(("[Dump Stack]=============================" + thread.getName() + " Stack end=======================\r\n"));
            }

        }

    });
}
function dumpSingleStackTrace() {
    Java.perform(function () {
        var Exception = Java.use("java.lang.Exception");
        var ins = Exception.$new("Exception");
        var Thread = Java.use('java.lang.Thread');
        var straces = ins.getStackTrace();
        if (undefined == straces || null == straces) {
            return;
        }

        console.log("[Dump Stack]=============================" + Thread.currentThread().getName() + " Stack start=======================");
        console.log("");
        for (var i = 0; i < straces.length; i++) {
            var str = "   " + straces[i].toString();
            console.log(str);
        }
        console.log("");
        console.log("[Dump Stack]=============================" + Thread.currentThread().getName() + " Stack end=======================\r\n");
        Exception.$dispose();

    });
}


// function main() {
//     // hook_java();
// }
// setImmediate(main)
