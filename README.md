# FoodScan Backend

**FoodScan** is a backend service for a nutrition and product scanning app that helps users make smarter food choices.  
The system allows users to scan product barcodes or upload package images, automatically extract text and nutrition data using OCR and public APIs, and store scan history securely.

---

## 🚀 Tech Stack

| Layer          | Technology                  | Purpose                              |
| -------------- | --------------------------- | ------------------------------------ |
| Backend        | **Node.js + Express.js**    | REST API server                      |
| Database       | **MongoDB + Mongoose**      | Data modeling and persistence        |
| Authentication | **JWT (JSON Web Tokens)**   | Secure user authentication           |
| OCR            | **Google Cloud Vision API** | Text extraction from product images  |
| Product Data   | **OpenFoodFacts API**       | Nutrition and ingredient info lookup |
| File Storage   | **AWS S3 / Cloudinary**     | Image upload and storage             |
| Deployment     | **Render**                  | Cloud hosting and CI/CD ready        |

---

## 🧱 Project Structure

```

foodscan-backend/
├── src/
│   ├── config/          # DB & cloud setup
│   ├── controllers/     # API route controllers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── utils/           # Helper functions (OCR, JWT, APIs)
│   └── server.js        # Entry point
├── .env                 # Environment variables
├── package.json
└── README.md

```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/azilrababe/foodscan-backend.git
cd foodscan-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and fill in:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=supersecretkey
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=foodscan-uploads
```

> 💡 _Make sure to download your Google Vision API credentials JSON and store it in the root directory._

### 4. Start the development server

```bash
npm run dev
```

---

## 🧠 Core Features

✅ **User Authentication**

- Sign up & login with passportjs
- Passwords hashed with bcrypt

✅ **Barcode Lookup**

- Retrieve product information via **OpenFoodFacts API**
- Caches product data in MongoDB for faster future queries

✅ **Image OCR Processing**

- Extract text from product labels using **Google Cloud Vision**
- Automatically detect nutrition or ingredient info

✅ **Scan Management**

- Save user scans (image, text, product)
- Retrieve scan history per user

✅ **Image Upload**

- Upload images to AWS S3 or Cloudinary using presigned URLs


## 📖 API Documentation (Swagger)

FoodScan uses [Swagger UI](https://swagger.io/tools/swagger-ui/) for interactive API documentation.

- **View docs locally:**  
  After starting the server, open [http://localhost:5000/api-docs](http://localhost:5000/api-docs) in your browser.

- **Spec location:**  
  The OpenAPI spec is located at `src/swagger.json`.

- **How to use:**
  - Try out endpoints directly from the Swagger UI.
  - See required request bodies, parameters, and response formats.
  - Authenticate protected routes by clicking "Authorize" and entering your JWT token.

## ☁️ Deployment

You can deploy the backend easily on **Render**, **Railway**, or **Vercel**:

- Push code to GitHub
- Connect repository to hosting platform
- Set all environment variables in the platform’s dashboard
- Deploy 🚀

---

## 🧑‍💻 Developer

**Author:** [Rababe Azil](https://github.com/azilRababe) </br>
**Role:** Backend Developer</br>
**Stack:** Node.js · MongoDB · Express.js · Google Cloud Vision · OpenFoodFacts API

---

## 📝 License

This project is licensed under the **MIT License**.
Feel free to use and modify it for educational or commercial purposes.

