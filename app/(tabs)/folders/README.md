# Symphora

![Status](https://img.shields.io/badge/Status-Complete-brightgreen)

An elegant mobile application designed for musicians to organize, manage, and browse their practice recordings through a structured and visually appealing interface.

Symphora helps musicians maintain a personal archive of recordings by organizing practice sessions across instruments, musical pieces, and recordings, making it easier to track progress and revisit performances over time.

---

## Overview

Musicians often accumulate hundreds of practice recordings scattered across folders, messaging apps, cloud storage, and devices. Finding a specific recording, comparing performances, or organizing practice sessions can quickly become difficult.

Symphora provides a dedicated workspace for managing musical recordings through a clean and intuitive mobile experience. Instead of treating recordings as isolated files, the application organizes them around the way musicians naturally practice: by instrument, piece, and session.

The project focuses on usability, organization, and aesthetic design while maintaining a simple workflow for everyday practice management.

---

## Features

### Recording Organization

* Centralized recording management
* Browse all recordings from a single location
* Structured storage and categorization

### Instrument-Based Navigation

* Organize recordings by instrument
* Separate practice sessions across multiple instruments
* Quickly access instrument-specific recordings

### Piece-Based Organization

* Group recordings by musical piece or song
* Track progress for individual compositions
* Maintain historical practice archives

### Recording Library

* Dedicated recordings view
* Browse and manage audio files
* Simplified access to practice history

### Modern Mobile Experience

* Bottom tab navigation
* Clean and immersive interface
* Responsive layouts
* Consistent user experience

### Security

* PIN setup and verification
* Protected access to personal recordings

### Cross-Platform Support

* Android
* iOS
* Web (via Expo)

---

## Screenshots

<img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/2b78814f-484b-4e24-9e1c-f8f7aced89ff" />

<img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/3c181249-872b-428b-ab6a-af30e94eacfb" />

<img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/0e07a4a9-1b0a-4752-a9e7-2fd1b87606a5" />

<img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/cca0959a-2e0c-4d3b-8570-89abf6716592" />

---

## Application Structure

```text
Musician
    │
    ▼
Instrument Selection
    │
    ▼
Piece Selection
    │
    ▼
Recording Collection
    │
    ▼
Playback & Management
```

The application mirrors a musician's natural workflow, allowing recordings to be accessed either through instruments, pieces, or a unified recordings view.

---

## Technology Stack

### Framework

* Expo
* React Native

### Language

* TypeScript

### Navigation

* Expo Router
* File-Based Routing

### User Interface

* React Native Components
* Custom Mobile UI Design

---

## Core Components

### Instrument Manager

Provides categorization and navigation of recordings based on instruments.

### Piece Manager

Groups recordings according to musical compositions and practice material.

### Recording Library

Acts as a centralized repository for all stored recordings.

### Navigation System

Handles seamless movement between organizational views through bottom-tab navigation.

### Security Layer

Manages PIN creation and verification to protect user data.

---

## Project Structure

```text
symphora/
│
├── app/
│   ├── (tabs)/
│   │   ├── folders/
│   │   │   ├── instrument.tsx
│   │   │   ├── piece.tsx
│   │   │   └── recordings.tsx
│   │   └── _layout.tsx
│   │
│   ├── index.tsx
│   ├── set-pin.tsx
│   └── verify-pin.tsx
│
├── components/
├── assets/
├── utils/
│
├── app.json
├── package.json
└── README.md
```

---

## Use Cases

### Music Students

* Organize practice recordings
* Monitor improvement over time
* Maintain structured archives

### Instrumentalists

* Separate recordings across instruments
* Track progress for specific pieces

### Teachers

* Review student recordings
* Organize performance submissions

### Hobby Musicians

* Maintain personal practice journals
* Build a searchable recording collection

---

## Local Setup

### Clone Repository

```bash
git clone https://github.com/Maverick572/symphora.git
cd symphora
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npx expo start
```

### Run Application

* Scan the QR code using Expo Go
* Run on Android Emulator
* Run on iOS Simulator
* Open in a web browser

---

## Challenges Solved

* Designing a recording organization workflow tailored to musicians
* Creating intuitive navigation across multiple organizational structures
* Maintaining a clean and aesthetically pleasing user experience
* Building a cross-platform mobile application with a single codebase
* Implementing secure access using PIN authentication

---

## Future Improvements

* Audio playback controls
* Recording metadata and tagging
* Practice session analytics
* Cloud synchronization
* Recording search and filtering
* Performance comparison tools
* Progress tracking dashboards
* Backup and export functionality

---

## Project Motivation

Musicians often rely on recordings to evaluate progress, refine techniques, and preserve performances. However, managing large collections of recordings becomes increasingly difficult over time.

Symphora was developed to provide a dedicated organizational system for music practice recordings, combining structured navigation, modern mobile design, and ease of use into a single platform tailored specifically for musicians.

---

## License

MIT License
