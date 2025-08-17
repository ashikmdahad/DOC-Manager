# Document Manager on AWS

A simple SaaS application that lets authenticated users upload, list, and download documents.  
Fully containerized for local development and provisioned on AWS (EC2, RDS, S3) via Terraform.  
CI/CD is automated with GitHub Actions.


## 🔥 Features

- **User Authentication** via JWT (signup & login)  
- **File Upload** to AWS S3 with `multer`  
- **File Listing & Download** using signed URLs  
- **Infrastructure as Code** with Terraform modules for S3, RDS, and EC2  
- **Containerized Development** (Docker & Docker Compose)  
- **Automated CI/CD** with GitHub Actions (Terraform → SSH deploy → S3 sync)  

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express, PostgreSQL, JWT, AWS SDK  
- **Frontend:** React, Vite, Axios  
- **Containerization:** Docker, Docker Compose  
- **Infrastructure:** Terraform, AWS (S3, RDS, EC2)  
- **CI/CD:** GitHub Actions  

---

## 🚀 Prerequisites

- Node.js ≥ 18 & npm  
- Docker & Docker Compose (for local dev)  
- Terraform ≥ 1.0  
- AWS CLI configured with IAM credentials  
- Git & a GitHub account  
- An existing AWS SSH keypair (for EC2)  

---

## 🚀 Running Locally with Docker

1.  **Clone the repository:**  
    ```bash
    git clone <repository-url>
    cd document-manager
    ```

2.  **Set up environment variables:**  
    Copy the `.env.example` files in both the `backend` and `frontend` directories to `.env` and customize them as needed.  
    ```bash
    cp backend/.env.example backend/.env
    cp frontend/.env.example frontend/.env
    ```

3.  **Build and run the containers:**  
    ```bash
    docker-compose up --build
    ```  
    The application will be available at `http://localhost`.

---

## 📚 Technical Documentation

### Backend

The backend is a Node.js/Express application that handles user authentication, file management, and API requests.

**API Endpoints:**

*   **Auth:** `POST /api/auth/signup`, `POST /api/auth/login`
*   **Files:** `GET /api/files`, `POST /api/files/upload`, `GET /api/files/:id`, `DELETE /api/files/:id`
*   **Folders:** `GET /api/folders`, `POST /api/folders`
*   **Shares:** `GET /api/shares`, `POST /api/shares`
*   **Tags:** `GET /api/tags`, `POST /api/tags`
*   **Comments:** `GET /api/comments`, `POST /api/comments`

### Frontend

The frontend is a React application built with Vite that provides the user interface for interacting with the document manager.

**Component Structure:**

*   `App.jsx`: Main application component.
*   `Folders.jsx`: Component for managing folders.
*   `Comments.jsx`: Component for handling comments on documents.
*   `Tags.jsx`: Component for managing tags.
*   `ActivityLog.jsx`: Displays user activity.
*   `Notifications.jsx`: Shows notifications.
*   `Share.jsx`: Handles file sharing.
*   `Trash.jsx`: Manages deleted files.
*   `VersionHistory.jsx`: Shows file version history.

### Database

The application uses a PostgreSQL database to store user data, file metadata, and other application-related information. The schema is defined in `backend/src/schema.sql`.
