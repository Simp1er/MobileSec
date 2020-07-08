# AndroidSec

## 1. Dalvik下DexClassLoader动态加载关键函数链(基于Android4.4)
![](./DexClassLoader/Dalvik_DexClassLoader.png)
## 2. Art下DexClassLoader动态加载关键函数链(基于Android8.0)
![](./DexClassLoader/Art_DexClassLoader.png)
## 3. Art下InMemoryDexClassLoader动态加载关键函数链(基于Android8.0)
![](./DexClassLoader/Art_InMemoryDexClassLoader.png)
## 4. Dalvik下RegisterNatives动态注册关键函数链(基于Android4.4)
![](./RegisterNatives/Dalvik_RegisterNatives.png)
## 4. Art下RegisterNatives动态注册关键函数链(基于Android8.1)
![](./RegisterNatives/Art_RegisterNatives.png)


## 2020-07-08 新增dex2apk.py
一个用于将脱壳下来的众多dex重新组装成apk的脚本，免去Android安全测试人员在逆向过程中不停`grep`的操作  

- usage: python dex2apk.py [-h] -a APK_PATH -i DEX_PATH [-o OUTPUT]   
![](imgs/usage.jpg)

![](imgs/usage_demo.jpg)  

将重新组合的`apk`拖入`jadx`和`jeb`,展示结果如下：  

![](imgs/demo.jpg)




