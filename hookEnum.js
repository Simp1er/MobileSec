/**
 * public enum enumClazz {
    OAID("QAID"),TOKEN("TOKEN"), VIP("1");

    private String value;
     enumClazz(String value){
        this.value = value;
    }

    public String getValue(){
        return this.value;
    }
    public void setValue(String value){
        this.value = value;
         // 2021-05-23 16:24:31.258 26207-26207/com.simp1er.enumdemo E/enum: className: OAID
         // 2021-05-23 16:24:31.262 26207-26207/com.simp1er.enumdemo E/enum: className: TOKEN
         // 2021-05-23 16:24:31.265 26207-26207/com.simp1er.enumdemo E/enum: className: VIP
         // 2021-05-23 16:24:31.419 26207-26207/com.simp1er.enumdemo E/enum: className: OAID
         // 2021-05-23 16:24:31.423 26207-26207/com.simp1er.enumdemo E/enum: className: TOKEN
         // 2021-05-23 16:24:31.426 26207-26207/com.simp1er.enumdemo E/enum: className: VIP
         Log.e("enum", "className: " + this );
        }
    }    
 */
function hook(){
    Java.perform(function(){
        var enumClazz = Java.use('com.simp1er.enumdemo.enumClazz')
    enumClazz.setValue.implementation = function(){
        var value = arguments[0];
        /**
         *  class => OAID , value => OAID_value
            class => TOKEN , value => TOKEN_value
            class => VIP , value => VIP_value
            class => OAID , value => OAID_value
            class => TOKEN , value => TOKEN_value
            class => VIP , value => VIP_value
            class => OAID , value => OAID_value
            class => TOKEN , value => TOKEN_value                                                                                                                                            
            class => VIP , value => VIP_value
            class => OAID , value => OAID_value
            class => TOKEN , value => TOKEN_value
            class => VIP , value => VIP_value
         */
        console.log('class =>',this,", value =>",value) // this即代表enum类的对象名称。
      //  console.log('class =>',this.getString())
        return this.setValue(value)
    }
    });
}

function main(){
    hook()
}


setImmediate(main)