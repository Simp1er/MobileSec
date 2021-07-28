
function hook() {
    Java.perform(function () {
        // var Six = Java.use('com.dta.test.frida.activity.SixthActivity')
        var target = Java.registerClass({
            name: 'com.dta.test.frida.activity.RegisterClass',
            // implements: [Six],
            // superClass: Java.use('java.lang.Object'),
            methods: {
                $init: function () {
                    console.log('Constructor called');
                },
                next: {
                    returnType: 'java.lang.Boolean',
                    // returnType: 'java.lang.Boolean',
                    //   argumentTypes: [],
                    argumentTypes: [],
                    implementation: function () {
                        console.log('call next')
                        return Java.use('java.lang.Boolean').$new('true');
                        // return Java.use('java.lang.Object').$new('true');
                        // return true;
                    },
                },
            }
        })
        var Six = Java.use('com.dta.test.frida.activity.SixthActivity')
        var pathLoader = Six.class.getClassLoader()
        var dexLoader = target.class.getClassLoader()
        console.log('activtity loader->',pathLoader)
        var parent = pathLoader.parent.value
        pathLoader.parent.value = dexLoader
        dexLoader.parent.value = parent


    })

}
function main() {
    hook()
}

setImmediate(main)