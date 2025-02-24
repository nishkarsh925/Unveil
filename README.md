# Unveil - Media Literacy Platform

## 🚀 Project Overview
**Unveil** is a comprehensive platform for media literacy that provides authentic and uncovered news. Its mission is to raise awareness about serious issues that governments and media may attempt to overshadow by diverting attention to other topics. As part of this platform, **Bias Detection System** is a tool designed to analyze and identify biases in textual content using Machine Learning. Additionally, **Unveil** integrates the **Groq API** to generate neutral versions of biased articles, promoting balanced and fair reporting.

## 📌 Features
- Media literacy platform with real-time news updates
- Bias detection in textual content using ML
- Generation of neutral versions of biased articles using Groq API
- Interactive web-based UI with Next.js
- FastAPI-powered backend for efficient model inference
- REST API for easy integration

## 🏗️ Project Status
This project is currently under development. Expect frequent updates and improvements.

## 📂 Project Structure
```
 unveil/
 ├── backend/                # FastAPI backend
 │   ├── main.py             # Main FASTAPI script
 │   ├── models/             # ML model code
 │   ├── requirements.txt    # Python dependencies

 ├── frontend/               # Next.js frontend
 │   ├── components/         # Reusable UI components
 │   ├── app/                # Next.js pages
 │   ├── package.json        # Frontend dependencies
 ├── README.md               # Project documentation
 ├── .gitignore              # Files to ignore in Git
 ├── LICENSE                 # License file



```

## 🛠️ Installation & Setup
### Backend (FastAPI)
1. **Clone the repository:**
   ```sh
   git clone https://github.com/nishkarsh925/Unveil.git
   cd Unveil/backend
   ```
2. **Create a virtual environment:**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
4. **Run the FastAPI server:**
   ```sh
   uvicorn main:app --reload
   ```

### Frontend (Next.js)
1. **Navigate to the frontend directory:**
   ```sh
   cd ../frontend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the Next.js application:**
   ```sh
   npm run dev
   ```
4. **Open the application in the browser:**
   ```
   http://localhost:3000
   ```

### Setting Up a Fresh Next.js App
If you're setting up from scratch:
```sh
npx create-next-app@latest frontend
cd frontend
```
Then, paste the repo files into the `frontend/` directory, excluding `.next/` and `node_modules/`.

## 🔗 API Endpoints
| Method | Endpoint       | Description                                     |
|--------|---------------|-------------------------------------------------|
| POST   | `/predict`    | Analyze text for bias                          |
| POST   | `/neutralize` | Generate a neutral version of biased articles  |
| POST   | `/verify`     | Check news authenticity using NewsAPI          |
| GET    | `/health`     | Check server health                            |

## 📜 License
This project is licensed under the [MIT License](LICENSE).

## 💡 Contributing
Contributions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## 📧 Contact
For any queries, feel free to reach out!
nishcodingzone@gmail.com
---
*This README will be updated as the project progresses.* 🚀

