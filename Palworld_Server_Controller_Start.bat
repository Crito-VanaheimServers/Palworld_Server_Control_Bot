@echo off

Taskkill /F /FI "WINDOWTITLE eq Palworld %serverName% Server Controller Bot" /T

timeout 1 > NUL

COLOR 0a

SETLOCAL EnableExtensions enabledelayedexpansion

TITLE Palworld %serverName% Server Controller Bot

@cls
node src/index.js

timeout 5 >nul
powershell -window minimized -command ""
