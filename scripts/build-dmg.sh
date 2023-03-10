#!/bin/sh

if [[ $OSTYPE != *darwin* ]]; then
    echo "当前操作系统不是MacOS"
    exit 0
fi

TOP=160
APP_LEFT=170
FOLDER_LEFT=$((TOP + 320))

sed "s/\<string\>English\<\/string\>/\<string\>Chinese\<\/string\>/g" "./src-tauri/target/release/bundle/macos/何方笔记.app/Contents/Info.plist" > Info.plist

mv Info.plist "./src-tauri/target/release/bundle/macos/何方笔记.app/Contents/Info.plist"

# test -f "./src-tauri/dist/何方笔记-v0.1.0.dmg" && rm "./src-tauri/dist/何方笔记-v0.1.0.dmg"
test -d "./src-tauri/dist" || mkdir "./src-tauri/dist"

TIME=$(date +"%Y%m%d%H%M%S")

create-dmg \
    --volname "何方笔记 v0.1.0" \
    --window-size 660 400 \
    --text-size 16 \
    --app-drop-link $FOLDER_LEFT $TOP \
    --volicon ./src-tauri/target/release/bundle/dmg/icon.icns \
    --icon "何方笔记.app" $APP_LEFT $TOP \
    --background "/Users/hefang/Downloads/Desktop.svg" \
    --hide-extension "何方笔记.app" \
    "./src-tauri/dist/何方笔记-v0.1.0-$TIME.dmg" \
    "./src-tauri/target/release/bundle/macos/何方笔记.app"
