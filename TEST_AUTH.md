# Test Auth Endpoints

## 1. Test Register
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"fullName":"Test User","email":"test@hcmut.edu.vn","password":"Test123"}'
```

## 2. Test Verify OTP
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/auth/verify-otp" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"test@hcmut.edu.vn","otp":"123456"}'
```

## 3. Test Login
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"test@hcmut.edu.vn","password":"Test123"}'
```

## 4. Test Google OAuth
Open in browser: http://localhost:3000/auth/google
