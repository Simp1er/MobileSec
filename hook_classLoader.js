
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
                      argumentTypes: [],
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

function hook1() {
    Java.perform(function () {
        // var Six = Java.use('com.dta.test.frida.activity.SixthActivity')
        Java.registerClass({
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
                      argumentTypes: [],
                    argumentTypes: [],
                    implementation: function () {
                        console.log('call next')
                        return Java.use('java.lang.Boolean').$new('true');
                        // return Java.use('java.lang.Object').$new('true');
                        // return true;
                    },
                },
            }
        });
        Java.enumerateClassLoaders({
            onMatch: function (laoder) {
                try {
                    laoder.loadClass('com.dta.test.frida.activity.RegisterClass')
                    console.log('loader', laoder)
                    Java.ClassFactory.loader = laoder
                } catch {
                    console.log('except')
                }
            },
            onComplete: function () {
                console.log('search complete')
            }

        })
        var Class = Java.use('java.lang.Class')
        Class.forName.overload('java.lang.String', 'boolean', 'java.lang.ClassLoader').implementation = function (str, init, loader) {
            console.log('loader', loader)
            console.log('className', str)
            console.log('iniit', init)
            return this.forName(str, init, Java.ClassFactory.loader)
        }

    })

}
function main() {
    hook()
}

setImmediate(main)