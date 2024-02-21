@echo off

Taskkill /F /FI "WINDOWTITLE eq Palworld Server Controller Bot" /T

timeout 1 > NUL

COLOR 0a

SETLOCAL EnableExtensions enabledelayedexpansion

TITLE Palworld Server Controller Bot

node src/register-commands.js
@cls
node src/index.js

timeout 5 >nul
powershell -window minimized -command ""
