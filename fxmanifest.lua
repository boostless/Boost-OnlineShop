fx_version "adamant"
games {"gta5"}

author 'Boost#4383'
description "Boost's online shop"
version '1.0.0'

shared_script 'config.lua'

client_scripts {
    'client/main.lua',
    'client/utils.lua'
}

server_scripts {
    '@mysql-async/lib/MySQL.lua',
    'server/main.lua'
}

ui_page "html/index.html"

files {
    "html/index.html",
    "html/app.js",
    "html/style.css",
    "html/css/tailwind.css",
    "html/img/*.png"
}