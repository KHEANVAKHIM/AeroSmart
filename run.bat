@echo off
echo ===================================================
echo   AeroSmart - Khoi dong he thong 1 Port duy nhat
echo   Dia chi truy cap: http://localhost:8080
echo ===================================================
echo.

echo [1/2] Dang dong goi Frontend vao Backend...
cd /d "%~dp0frontend"
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Loi khi build Frontend!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Dang khoi dong Spring Boot Server (Port 8080)...
cd /d "%~dp0backend"
call .\mvnw.cmd spring-boot:run

pause
