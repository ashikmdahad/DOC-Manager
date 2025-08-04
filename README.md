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

