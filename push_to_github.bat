@echo off
chcp 65001 > nul
echo =======================================================
echo    DANG CHUAN BI VA DAY TOAN BO CODE LEN GITHUB
echo =======================================================
echo Repo: https://github.com/HoangKyAnh05/Tool_landing-page.git
echo.

REM Kiem tra xem da khoi tao git chua
if not exist ".git" (
    echo [1/5] Khoi tao Git repository...
    git init
    git branch -M main
) else (
    echo [1/5] Thu muc .git da ton tai.
    git branch -M main
)

REM Kiem tra remote origin
echo.
echo [2/5] Kiem tra remote origin...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Them remote origin: https://github.com/HoangKyAnh05/Tool_landing-page.git
    git remote add origin https://github.com/HoangKyAnh05/Tool_landing-page.git
) else (
    echo Cap nhat remote origin: https://github.com/HoangKyAnh05/Tool_landing-page.git
    git remote set-url origin https://github.com/HoangKyAnh05/Tool_landing-page.git
)

REM Them tat ca cac file vao git
echo.
echo [3/5] Git add all files...
git add .

REM Commit code
echo.
echo [4/5] Tao commit...
set /p commit_msg="Nhap noi dung commit (de trong neu dung mac dinh 'Update landing page'): "
if "%commit_msg%"=="" (
    set commit_msg=Update Sapa Komorebi Sanctuary landing page images and effects
)
git commit -m "%commit_msg%"

REM Day code len github
echo.
echo [5/5] Dang day code len nhanh main cua GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo =======================================================
    echo [CANH BAO] Push that bai! 
    echo Co the repo tren GitHub da co san file README/License hoac can dang nhap GitHub.
    echo.
    echo Ban co muon thu push kem force push khong?
    echo 1. Force push (Ghi de toan bo repo tren GitHub)
    echo 2. Thoat
    echo =======================================================
    set /p choice="Chon (1/2): "
    if "%choice%"=="1" (
        echo Dang force push...
        git push -u origin main --force
    )
)

echo.
echo =======================================================
echo HOAN TAT! Nhan phim bat ky de thoat...
echo =======================================================
pause > nul
