# 🚀 Render Deployment Guide

## ❌ **Current Issue**
Your app is getting 404 errors because it's trying to connect to the wrong Convex URL.

## ✅ **Solution Options**

### **Option 1: Configure Environment Variable in Render (RECOMMENDED)**

1. **Go to your Render dashboard**
2. **Select your deployed service**
3. **Go to "Environment" tab**
4. **Add this environment variable:**
   ```
   Key: VITE_CONVEX_URL
   Value: https://graceful-mouse-263.convex.cloud
   ```
5. **Click "Save Changes"**
6. **Redeploy your service**

### **Option 2: Use Production Build Script**

Run this command locally to build with the correct URL:
```bash
npm run build:prod
```

Then deploy the `dist/` folder to Render.

### **Option 3: Update Render Build Command**

In your Render service settings, change the build command to:
```bash
VITE_CONVEX_URL=https://graceful-mouse-263.convex.cloud npm run build
```

## 🔧 **Step-by-Step Fix**

### **Method 1: Environment Variable (Easiest)**

1. **Login to Render dashboard**
2. **Find your deployed service**
3. **Click on your service name**
4. **Go to "Environment" tab**
5. **Add new environment variable:**
   - **Key**: `VITE_CONVEX_URL`
   - **Value**: `https://graceful-mouse-263.convex.cloud`
6. **Click "Save Changes"**
7. **Go to "Manual Deploy" tab**
8. **Click "Deploy latest commit"**

### **Method 2: Local Build and Deploy**

1. **Run production build:**
   ```bash
   npm run build:prod
   ```

2. **Upload the `dist/` folder to Render**

## 🎯 **Verification**

After deployment, check:
1. **Open browser developer tools**
2. **Go to Network tab**
3. **Try to login**
4. **Look for requests to `graceful-mouse-263.convex.cloud`**
5. **No more 404 errors should appear**

## 📱 **Expected Behavior**

After fixing:
- ✅ Universal loader appears on page load
- ✅ Login form loads correctly
- ✅ Authentication works with your Convex backend
- ✅ All dashboards function properly

## 🚨 **If Still Having Issues**

1. **Check Render logs** for any build errors
2. **Verify environment variable** is set correctly
3. **Clear browser cache** and try again
4. **Check Convex dashboard** to ensure backend is running

## 🎉 **Success Indicators**

When working correctly, you should see:
- Loading screen with progress bar
- Successful login with your admin credentials
- Access to all dashboards
- Real-time data from Convex

**Your app will be fully functional!** 🚀

