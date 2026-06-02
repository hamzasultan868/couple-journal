# Firebase Security Rules

## Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is part of a couple
    function isCoupleMember(coupleId) {
      let couple = get(/databases/$(database)/documents/couples/$(coupleId));
      return request.auth.uid == couple.data.partner1Id || 
             request.auth.uid == couple.data.partner2Id;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Couples collection
    match /couples/{coupleId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && isCoupleMember(coupleId);
      allow delete: if false; // Couples should not be deleted directly
    }
    
    // Entries collection
    match /entries/{entryId} {
      allow read: if request.auth != null && 
                    isCoupleMember(resource.data.coupleId);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                      isCoupleMember(resource.data.coupleId);
      allow delete: if request.auth != null && 
                      (request.auth.uid == resource.data.authorId || 
                       isCoupleMember(resource.data.coupleId));
    }
  }
}
```

## Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Images for couples
    match /couples/{coupleId}/images/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.resource.size < 5 * 1024 * 1024 && // Max 5MB
                     request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null;
    }
  }
}
```

## Apply Rules

### Via Firebase Console
1. Go to Firestore Database → Rules
2. Paste the Firestore rules
3. Publish

### Via Firebase CLI
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```
