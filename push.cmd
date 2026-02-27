@echo off
setlocal enabledelayedexpansion
set "REPO=https://github.com/rajaasim4/insola-payment.git"
set "README=README.md"
set "BRANCH=main"
set "MSG=first commit"

:: 1. Create README if missing
if not exist "%README%" (
    echo # maintenix-react > "%README%"
    echo Created %README%
)

:: 2. Init repo if .git folder absent
if not exist ".git" (
    git init
    echo Initialised empty Git repository
)

:: 3. Stage everything
git add .

:: 4. Commit only if something changed
git diff-index --quiet HEAD
if errorlevel 1 (
    git commit -m "%MSG%"
    echo Committed changes
) else (
    echo Nothing to commit
)

:: 5. Rename branch to main if still on master
for /f "tokens=*" %%b in ('git rev-parse --abbrev-ref HEAD') do set "CUR=%%b"
if /i "%CUR%"=="master" (
    git branch -M %BRANCH%
    echo Renamed branch to %BRANCH%
)

:: 6. Add remote only if origin does not exist
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin %REPO%
    echo Added remote origin -^> %REPO%
)

:: 7. Push (set upstream)
git push -u origin %BRANCH%
echo Push complete
endlocal
pause
