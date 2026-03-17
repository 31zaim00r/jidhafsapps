# Azaa Jidhafs - Arabic Poetry Archive Project Overview

This document provides a comprehensive overview of the current application architecture, technology stack, and features. It is intended to be used as a reference for AI agents or developers to build similar systems.

## 1. Project Identity & Purpose
*   **Name:** Azaa Jidhafs - Arabic Poetry Archive
*   **Purpose:** A digital archive for preserving and sharing Arabic poetry (Azaa, Mowashah) with a focus on auditory and textual content.
*   **Target Audience:** Poetry enthusiasts, community members.
*   **Platform:** Responsive Web Application (Mobile-First Design).

## 2. Technology Stack

### Frontend
*   **Framework:** Flutter
*   **Language:** Dart
*   **State Management:** Provider / Riverpod / Bloc (Recommended)
*   **Styling:** 
    *   **Theme:** Custom `ThemeData` with Material 3 support.
    *   **Custom Colors:** 
        *   `primary`: Color(0xFFD4A373) (Gold)
        *   `scaffoldBackgroundColor`: Color(0xFFF5F0E6) (Soft Beige)
    *   **Fonts:** `google_fonts` package - 'Tajawal' (UI) and 'Amiri' (Poetry text).
*   **Icons:** `cupertino_icons` or `lucide_icons`.
*   **Routing:** `go_router` or `Navigator 2.0` (Mobile-app standard).

### Backend & Database
*   **Platform:** Supabase
*   **Database:** PostgreSQL
*   **Authentication:** Supabase Auth (Email/Password).
*   **Storage:** Supabase Storage (for poem audio/media).

## 3. Project Structure (Flutter)

```
/lib
├── main.dart         # Application entry point & Theme setup
├── models/           # Dart data models (Profile, Poem, Occasion)
├── screens/          # Application screens (HomePage, PoemDetailsPage, etc.)
├── widgets/          # Reusable widgets (CustomAppBar, BottomNav, etc.)
├── services/         # Supabase service & Auth logic
├── utils/            # Constants, Theme definitions, Routes
└── providers/        # State management (if using Provider)
pubspec.yaml          # Dependencies (supabase_flutter, google_fonts, etc.)
```

## 4. Key Features

### Authentication & Users
*   **Login/Register:** Email and password authentication.
*   **Profiles:** User profiles with name, phone, and role capabilities.
*   **Roles:** 
    *   `User`: Can view poems, add favorites.
    *   `Admin`: Can manage users, upload poems, manage occasions.

### Poetry Management
*   **Viewing:** Browse poems by list or detailed view.
*   **Search:** Search functionality for finding specific poems.
*   **Favorites:** Users can mark poems as favorites.
*   **My Poems:** Authenticated users can view their uploaded content (if permission granted).
*   **Details:** Detailed view including Poet name, Category (Waqfa, Mowashah), and Audio playback.

### Admin Features
*   **Dashboard:** Overview of system stats.
*   **User Management:** Manage user roles and permissions.
*   **Content Management:** Upload new poems, create new occasions/categories.

## 5. Database Schema Overview

The application uses the following key tables:

1.  **profiles**: Extends auth.users with `name`, `phone`, `can_upload`.
2.  **user_roles**: Manages access levels (`admin`, `user`).
3.  **occasions**: Categories for poems (e.g., specific religious events).
4.  **poems**: Stores poem metadata (`title`, `poet_name`, `category`, `media_url`).

## 6. Design System Details

*   **Theme:** Traditional yet modern "Gold & Beige" aesthetic.
*   **Typography:** 
    *   Headings/Body: 'Tajawal' (Sans-serif Arabic).
    *   Poetry Verses: 'Amiri' (Serif Arabic).
*   **User Experience:** 
    *   Smooth page transitions.
    *   Bottom interaction bar for mobile users.
    *   Clean, card-based layouts for lists.

## 7. Configuration for Recreation

To recreate this system, ensure the following environment variables are set (typically in `.env`):
*   `VITE_SUPABASE_URL`
*   `VITE_SUPABASE_ANON_KEY`

This architecture prioritizes a lightweight frontend with a powerful Backend-as-a-Service (BaaS) to handle data and auth complexity.
