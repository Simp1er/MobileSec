function getApplicationContext() {

   /*
     ref : https://blog.csdn.net/u010314594/article/details/49101629
    Class<?> ActivityThread = Class.forName("android.app.ActivityThread");
    Method method = ActivityThread.getMethod("currentActivityThread");
    Object currentActivityThread = method.invoke(ActivityThread);//获取currentActivityThread 对象
 
    Method method2 = currentActivityThread.getClass().getMethod("getApplication");
    CONTEXT_INSTANCE =(Context)method2.invoke(currentActivityThread);//获取 Context对象
   */
   Java.perform(function () {
     var ActivityThread = Java.use('android.app.ActivityThread')
     var currentActivityThread = null
     Java.choose('android.app.ActivityThread', {
       onMatch: function (ins) {
         console.log('found instance', ins)
         currentActivityThread = ins
       }, onComplete: function () {
 
       }
     })
     // var currentActivityThread =  ActivityThread.currentActivityThread()
     // var currentActivityThread_obj = Java.cast(currentActivityThread,ActivityThread)
     var application = currentActivityThread.getApplication()
     // var Context = Java.use('android.content.Context')
     // var context_obj = Java.cast(application,Context)
     console.log('context is ',application)
     return application;
   })
 }