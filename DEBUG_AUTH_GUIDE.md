# 🔧 Cách Test & Debug Auth System

## ✅ Đã Fix:
1. **CORS** - Đã enable CORS trong backend `main.ts`
2. **Validation Pipe** - Đã add global validation
3. **Google OAuth Button** - Fix import authService thay vì useAuth
4. **RegisterPage** - Fix typo button position

## 📋 Checklist Test:

### 1️⃣ Test Backend (API works ✅)
```powershell
# Test Register API
Invoke-WebRequest -Uri "http://localhost:3000/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"fullName":"Test User","email":"test@hcmut.edu.vn","password":"Test123"}'

# Expected: 201 Created + OTP message
```

### 2️⃣ Test Frontend Register Form

**Mở Browser DevTools (F12):**

#### Console Tab - Check errors:
- CORS error? ❌ → Backend cần enable CORS (ĐÃ FIX ✅)
- Network error? → Backend không chạy
- 400 Bad Request? → Validation error
- 409 Conflict? → Email đã tồn tại

#### Network Tab - Check request:
1. Tìm request: `POST http://localhost:3000/auth/register`
2. Check **Request Payload**:
   ```json
   {
     "fullName": "...",
     "email": "...@hcmut.edu.vn",
     "password": "...",
     "phone": "..." // optional
   }
   ```
3. Check **Response**:
   - Status: `201 Created`
   - Body: `{"success": true, "message": "OTP sent...", "email": "..."}`

### 3️⃣ Common Issues & Solutions:

#### ❌ Issue 1: CORS Error
```
Access to XMLHttpRequest at 'http://localhost:3000/auth/register' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution:** ✅ Đã fix trong `Backend/src/main.ts`

#### ❌ Issue 2: Password Validation Error
```json
{
  "statusCode": 400,
  "message": ["Password must contain uppercase, lowercase and number"],
  "error": "Bad Request"
}
```
**Solution:** Password phải có:
- Ít nhất 6 ký tự
- Ít nhất 1 CHỮ HOA (A-Z)
- Ít nhất 1 chữ thường (a-z)
- Ít nhất 1 chữ số (0-9)

**Valid examples:**
- `Test123` ✅
- `Hello1` ✅
- `Pass123Word` ✅

**Invalid examples:**
- `test123` ❌ (thiếu uppercase)
- `TEST123` ❌ (thiếu lowercase)
- `TestPass` ❌ (thiếu số)
- `Test1` ❌ (< 6 ký tự)

#### ❌ Issue 3: Email Validation Error
```json
{
  "statusCode": 400,
  "message": ["Email must be a valid @hcmut.edu.vn address"],
  "error": "Bad Request"
}
```
**Solution:** Email phải có đuôi `@hcmut.edu.vn`
- ✅ `student@hcmut.edu.vn`
- ❌ `student@gmail.com`

#### ❌ Issue 4: Email Already Exists
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```
**Solution:** Email này đã đăng ký rồi, dùng email khác hoặc login

### 4️⃣ Test Full Register Flow:

1. **Mở:** http://localhost:5173/register
2. **Điền form:**
   - Họ và tên: `Nguyen Van A`
   - Email: `nguyenvana@hcmut.edu.vn`
   - Số điện thoại: `0123456789` (optional)
   - Mật khẩu: `Test123456`
   - Xác nhận mật khẩu: `Test123456`
3. **Click:** "Tiếp tục"
4. **Kết quả:** 
   - ✅ Success: Redirect đến `/verify-otp?email=nguyenvana@hcmut.edu.vn`
   - ❌ Error: Hiển thị message lỗi

### 5️⃣ Test Google OAuth:

1. **Click:** "Đăng nhập bằng Google"
2. **Kết quả:** Popup mở lên → Google login page
3. **Login:** Với email `@hcmut.edu.vn`
4. **Callback:** Popup tự đóng → redirect to `/dashboard`

**Note:** Google OAuth chỉ chấp nhận email `@hcmut.edu.vn`

### 6️⃣ Check Backend Logs:

Terminal running `npm run start:dev` sẽ show:
```
[Nest] LOG [RouterExplorer] Mapped {/auth/register, POST} route
Application is running on: http://localhost:3000
```

### 7️⃣ Check Email:

- OTP được gửi đến email `tranphucducht05@gmail.com` (config trong .env)
- Check spam folder nếu không thấy email

## 🐛 Debug Steps:

1. **Backend không chạy?**
   ```powershell
   cd Backend
   npm run start:dev
   ```

2. **Frontend không chạy?**
   ```powershell
   cd Frontend
   npm run dev
   ```

3. **Test backend trực tiếp:**
   ```powershell
   curl http://localhost:3000
   # Expected: Hello World hoặc welcome message
   ```

4. **Clear browser cache & localStorage:**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

5. **Check axios đã install?**
   ```powershell
   cd Frontend
   npm list axios
   # Should show: axios@... 
   ```

## 📝 Summary:

✅ **Backend:** Port 3000, CORS enabled, validation enabled
✅ **Frontend:** Port 5173, axios configured, authService ready
✅ **Flow:** Register → OTP Email → Verify OTP → Login → Dashboard
✅ **Google OAuth:** Popup window → postMessage → auto close
