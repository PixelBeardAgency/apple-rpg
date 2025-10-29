# Supabase Storage Setup for Profile Pictures

## Overview
This guide explains how to set up Supabase Storage to enable profile picture uploads.

---

## Step 1: Create Storage Bucket

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **New bucket**
5. Create a bucket with these settings:
   - **Name**: `profile-pictures`
   - **Public**: ✅ Yes (check this box)
   - **File size limit**: 5MB
   - **Allowed MIME types**: Leave empty (allow all image types)
6. Click **Create bucket**

---

## Step 2: Set Up Storage Policies

The bucket needs to allow authenticated users to upload and read their own profile pictures.

### Go to Policies

1. Click on the `profile-pictures` bucket
2. Click **Policies** tab
3. Add the following policies:

### Policy 1: Allow Users to Upload
```sql
-- Name: Users can upload their own profile pictures
-- Operation: INSERT
-- Target: public.profile-pictures

CREATE POLICY "Users can upload profile pictures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND (storage.foldername(name))[1] = 'avatars'
);
```

### Policy 2: Allow Public Read Access
```sql
-- Name: Anyone can view profile pictures
-- Operation: SELECT
-- Target: public.profile-pictures

CREATE POLICY "Public read access for profile pictures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');
```

### Policy 3: Allow Users to Update Their Own
```sql
-- Name: Users can update their own profile pictures
-- Operation: UPDATE
-- Target: public.profile-pictures

CREATE POLICY "Users can update their profile pictures"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND (storage.foldername(name))[1] = 'avatars'
);
```

### Policy 4: Allow Users to Delete Their Own
```sql
-- Name: Users can delete their own profile pictures
-- Operation: DELETE
-- Target: public.profile-pictures

CREATE POLICY "Users can delete their profile pictures"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND (storage.foldername(name))[1] = 'avatars'
);
```

---

## Step 3: Test in Supabase Dashboard

1. Go to **Storage** → **profile-pictures**
2. Try uploading a test image manually
3. Verify the image appears in the bucket
4. Copy the public URL and verify it loads in a browser

---

## Step 4: Frontend Implementation (Already Done!)

The following files have been created/updated:

✅ **`frontend/src/components/profile/ProfilePictureUpload.jsx`**
- Handles file selection
- Image preview
- Upload to Supabase Storage
- Updates user profile with new URL

✅ **`frontend/src/pages/Profile.jsx`**
- Integrated upload component
- Displays current profile picture
- Refetches profile after upload

✅ **`frontend/src/components/layout/Header.jsx`**
- Shows profile picture next to username
- Fallback to User icon if no picture

---

## How It Works

1. **User selects image** → Preview shown
2. **User clicks Upload** → Image uploaded to `avatars/{userId}-{timestamp}.{ext}`
3. **Get public URL** → URL stored in `users.profile_picture_url`
4. **Update database** → Profile refetched to show new picture everywhere

---

## Supported Formats

- **JPG / JPEG**
- **PNG**
- **GIF**
- **WEBP**

Max size: **5MB**

---

## File Storage Structure

```
profile-pictures/
  └── avatars/
      ├── user-id-1-1234567890.jpg
      ├── user-id-2-1234567891.png
      └── user-id-3-1234567892.webp
```

---

## Security Features

✅ **Authenticated upload only** - Only logged-in users can upload  
✅ **Public read** - Anyone can view profile pictures (needed for sharing)  
✅ **File size limit** - 5MB max prevents abuse  
✅ **Organized structure** - Files stored in `avatars/` folder  
✅ **Unique filenames** - `userId-timestamp.ext` prevents conflicts  

---

## Testing Checklist

After setup, test these:

- [ ] Create storage bucket
- [ ] Set up all 4 policies
- [ ] Upload test image in Supabase dashboard
- [ ] Verify public URL works
- [ ] Upload image via app (Profile page)
- [ ] Verify image appears in Header
- [ ] Verify image appears in Profile
- [ ] Upload different image (should update everywhere)
- [ ] Test with different formats (JPG, PNG, GIF, WEBP)
- [ ] Test file size validation (try >5MB)
- [ ] Test with another user account

---

## Troubleshooting

### "Failed to upload image"
- Check that bucket is named `profile-pictures` (exact match)
- Verify bucket is set to **Public**
- Check that all 4 policies are created

### "Image doesn't appear"
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Check Network tab for 404 errors
- Verify URL in database is correct

### "Access denied"
- Ensure user is authenticated
- Check policies are applied to `authenticated` role
- Verify bucket permissions are correct

---

## Ready to Test!

Once you've completed the setup in Supabase, you can test the profile picture upload feature in the app! 🎉

