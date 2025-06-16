# Blogging App 📝

A simple full-stack blogging application using Node.js, Express, MongoDB (Atlas), and React with Tailwind CSS. Users can register, log in, create, view, edit, and delete their own blog posts.  

---

## 🚀 Features

- ✅ User registration & login with JWT authentication  
- 🗒️ Create, read, update, delete (CRUD) operations for blog posts  
- 📸 Image upload support via base64 or Cloudinary  
- ⚡ Responsive UI built with React, TailwindCSS, and React Router  
- 🔄 State management using RTK Query + Redux Toolkit  

---

## 📚 Tech Stack

| Layer       | Technology                           |
|-------------|--------------------------------------|
| Backend     | Node.js, Express, MongoDB (Atlas), Mongoose, JWT, bcrypt |
| Frontend    | React, TypeScript, Tailwind CSS, React Router, React-Redux, RTK Query |
| Others      | react-hot-toast, Zod (schema), Cloudinary |

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)  
- MongoDB Atlas account with a cluster setup  
- Yarn or npm

---

### ⚙️ Backend Setup

1. Clone the repo and navigate to `server/`:

    ```bash
    git clone <https://github.com/NandhuKrishhna/blogApp.git>
    cd project-root/backend
    ```

2. Install dependencies:

    ```bash
    npm install
    # or yarn
    ```

3. Create a `.env` file at `backend/` root with:

    ```env
    MONGO_URI=<Your_Atlas_Connection_URI>
    JWT_SECRET=<Your_JWT_Secret>
    JWT_REFRESH_SECRET=<Your_Refresh_Token_Secret>
    CLOUDINARY_URL=<Your_Cloudinary_Config>  # if using image upload
    ```

4. Start the backend server (hot-reloading with ts-node):

    ```bash
    npm run dev
    ```

The API will be available at `http://localhost:3000/api`.

---

### 💻 Frontend Setup

1. Navigate to the `client/` folder:

    ```bash
    cd ../frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. (Optional) Set up environment variables in `.env` (e.g., `VITE_SOCKET_URL`).

4. Run the development server:

    ```bash
    npm run dev
    ```

The app will open at `http://localhost:5173`.

---

## ✅ Usage

1. Sign up or log in from the landing page.
2. Once authenticated, you'll be redirected to `/home`.
3. Create new articles via the modal, edit or delete your own posts.
4. Explore pagination, search, and category filters if enabled.

---



