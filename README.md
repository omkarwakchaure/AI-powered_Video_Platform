# AI-Powered Multilingual Video Learning Platform

An intelligent video learning platform built with **React**, **Redux Toolkit**, **YouTube Data API**, and **Google Gemini AI** that helps users consume video content faster through AI-generated multilingual summaries.

## Problem Statement

Many users do not have the time to watch long-form YouTube videos just to extract key information.

For example, someone looking for a recipe may only need the ingredients and steps rather than watching a 15–20 minute video.

This platform solves that problem by generating structured AI-powered summaries that allow users to understand video content within minutes.

---

## Features

### Video Discovery

* Browse trending and popular videos
* Category-based filtering

  * Education
  * Gaming
  * Entertainment
  * Technology
  * Music
  * Sports
* Infinite scrolling using YouTube pagination tokens
* Real-time search suggestions
* Responsive and mobile-friendly UI

### Video Watching Experience

* Watch videos directly within the application
* Dynamic video routing
* Related video recommendations
* Comments integration using YouTube APIs
* Smooth navigation between videos

### AI-Powered Video Summaries

Using **Google Gemini AI**, the platform generates structured summaries for videos.

Each summary includes:

#### AI Summary

A concise overview of the entire video.

#### Key Points

Important concepts and highlights extracted from the content.

#### Detailed Guide

Step-by-step explanation of the topics covered in the video.

#### Important Takeaways

Actionable insights and final conclusions.

### Multilingual Support

Users can generate summaries in:

* English
* Hindi
* Marathi

This makes content more accessible for regional users.

### PDF Export

Users can download AI-generated summaries as professionally formatted PDF documents containing:

* Summary
* Key Points
* Detailed Guide
* Important Takeaways

Useful for:

* Offline reading
* Sharing
* Study notes
* Recipe instructions
* Quick reference material

### Watch Later

* Save videos for later viewing
* LocalStorage persistence
* Seamless user experience

---

## Tech Stack

### Frontend

* ReactJS
* JavaScript
* Redux Toolkit
* React Router
* Tailwind CSS

### APIs

* YouTube Data API
* Google Gemini AI API

### PDF Generation

* React PDF Renderer
* File Saver

---

## Performance Optimizations

* Infinite Scrolling
* Lazy Loading
* Code Splitting
* Redux Caching
* Debounced Search
* Shimmer Loading States
* Reusable Component Architecture

---

## Application Flow

1. User discovers videos through categories or search.
2. User selects a video.
3. Video details, comments, and recommendations are fetched using YouTube APIs.
4. User opens the AI Summary section.
5. Gemini AI generates:

   * Summary
   * Key Points
   * Detailed Guide
   * Important Takeaways
6. User can switch between:

   * English
   * Hindi
   * Marathi
7. User can export the generated summary as a PDF.

---

## Key Learnings

* Integrating multiple external APIs
* Working with AI-powered applications
* Managing complex state with Redux Toolkit
* Building scalable React architectures
* Optimizing frontend performance
* Generating dynamic PDF reports
* Implementing multilingual user experiences

---

## Future Enhancements

* User Authentication
* Summary History
* Bookmarks & Favorites
* Voice Narration of Summaries
* AI Chat with Video Content
* Video Chapter Generation
* Timestamp-Based Summaries
* Personalized Recommendations

---

## Project Motivation

This project was inspired by a real-world problem.

Many users, including family members, often want the important information from a video without spending time watching the entire content. The goal was to leverage AI to make learning and information consumption faster, more accessible, and available in multiple languages.

---

## Demo

* Live Application: [Add Link]

---

## Author

**Omkar Wakchaure**

Frontend Developer

Built using React, Redux Toolkit, YouTube Data API, and Google Gemini AI.
