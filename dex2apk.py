import os
import zipfile
import argparse


def rename_class(path):
    files = os.listdir(path)
    dex_index = 0
    if path.endswith('/'):
        path = path[:-1]
        print(path)
    for i in range(len(files)):
        if files[i].endswith('.dex'):
            old_name = path + '/' + files[i]
            if dex_index == 0:
                new_name = path + '/' + 'classes.dex'
            else:
                new_name = path + '/' + 'classes%d.dex' % dex_index
            dex_index += 1
            if os.path.exists(new_name):
                continue
            os.rename(old_name, new_name)
    print('[*] 重命名完毕')


def extract_META_INF_from_apk(apk_path, target_path):
    r = zipfile.is_zipfile(apk_path)
    if r:
        fz = zipfile.ZipFile(apk_path, 'r')
        for file in fz.namelist():
            if file.startswith('META-INF'):
                fz.extract(file, target_path)
    else:
        print('[-] %s 不是一个APK文件' % apk_path)


def zip_dir(dirname, zipfilename):
    filelist = []
    if os.path.isfile(dirname):
        if dirname.endswith('.dex'):
            filelist.append(dirname)
    else:
        for root, dirs, files in os.walk(dirname):
            for dir in dirs:
                # if dir == 'META-INF':
                # print('dir:', os.path.join(root, dir))
                filelist.append(os.path.join(root, dir))
            for name in files:
                # print('file:', os.path.join(root, name))

                filelist.append(os.path.join(root, name))

    z = zipfile.ZipFile(zipfilename, 'w', zipfile.ZIP_DEFLATED)
    for tar in filelist:
        arcname = tar[len(dirname):]

        if ('META-INF' in arcname or arcname.endswith('.dex')) and '.DS_Store' not in arcname:
            # print(tar + " -->rar: " + arcname)
            z.write(tar, arcname)
    print('[*] APK打包成功，你可以拖入APK进行分析啦！'  )
    z.close()


def parse_args():
    parser = argparse.ArgumentParser(description='repackage dumped dex to apk for jeb/jadx analysis.')
    parser.add_argument('-a', '--apk_path', required=True, type=str,
                        help='apk for extracting META-INF')
    parser.add_argument('-i', '--dex_path', required=True, type=str,
                        help='path of dumped dex')
    parser.add_argument('-o', '--output', type=str, default="repacked.apk",
                        help='apk path after zip')
    args = parser.parse_args()
    #print(args.apk_path)
    return args


if __name__ == '__main__':
    args = parse_args()
    rename_class(args.dex_path)
    extract_META_INF_from_apk(args.apk_path, args.dex_path)
    # zip_file(args.dex_path)
    zip_dir(args.dex_path, args.output)
