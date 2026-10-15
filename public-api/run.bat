@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

set "ENV_FILE=.env"
set "JAR_FILE=build\libs\public-api-1.0.jar"

if not exist "%ENV_FILE%" (
    echo ERROR: %ENV_FILE% not found in %CD%
    exit /b 1
)
if not exist "%JAR_FILE%" (
    echo ERROR: %JAR_FILE% not found. Build it with: gradlew.bat bootJar
    exit /b 1
)

rem Load KEY=VALUE lines, skipping blank lines and # comments
for /f "usebackq eol=# tokens=1* delims==" %%A in ("%ENV_FILE%") do (
    set "%%A=%%B"
)

java -jar "%JAR_FILE%" %*
endlocal
