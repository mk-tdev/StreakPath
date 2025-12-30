# Firebase Configuration Security

**IMPORTANT**: Firebase credentials are now managed via environment variables and are NOT pushed to GitHub.

## Setup Instructions for Team Members

When someone clones your repository:

### 1. Copy Environment Variables
```bash
cp .env.example .env
```

### 2. Get Firebase Credentials
Download from Firebase Console or get from team lead, then update `.env` with actual values:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
...etc
```

### 3. Add google-services.json
Place the file in project root (get from Firebase Console or team lead)

### 4. Install & Run
```bash
npm install
npm run android
```

## What's Protected

✅ `.env` - Environment variables  
✅ `google-services.json` - Android Firebase config  
✅ `GoogleService-Info.plist` - iOS Firebase config  
✅ All API keys and credentials

## Files in Repository

✅ `.env.example` - Template (no actual credentials)  
✅ `firebase.ts` - Reads from environment variables  
✅ `.gitignore` - Protects sensitive files

**This is production-ready security** for your beta release!
