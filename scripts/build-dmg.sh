#!/bin/sh

if [[ $OSTYPE != *darwin* ]]; then
    echo "当前操作系统不是MacOS"
    exit 0
fi

TOP=160
APP_LEFT=170
FOLDER_LEFT=$((TOP + 320))
# VERSION=0.2.2

sed "s/\<string\>English\<\/string\>/\<string\>Chinese\<\/string\>/g" "./src-tauri/target/release/bundle/macos/何方笔记.app/Contents/Info.plist" >Info.plist

mv Info.plist "./src-tauri/target/release/bundle/macos/何方笔记.app/Contents/Info.plist"

test -d "./src-tauri/dist" && rm -rf "./src-tauri/dist"
mkdir "./src-tauri/dist"

TIME=$(date +"%Y%m%d%H%M%S")


./src-tauri/target/release/bundle/dmg/bundle_dmg.sh \
    --volname "何方笔记 v$VERSION" \
    --window-size 660 400 \
    --text-size 16 \
    --app-drop-link $FOLDER_LEFT $TOP \
    --volicon ./src-tauri/target/release/bundle/dmg/icon.icns \
    --icon "何方笔记.app" $APP_LEFT $TOP \
    --background "./src-tauri/icons/dmg-background.svg" \
    --hide-extension "何方笔记.app" \
    "./src-tauri/dist/何方笔记_x64.dmg" \
    "./src-tauri/target/release/bundle/macos/何方笔记.app"
