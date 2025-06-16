import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./Pages/LoginPage"
import PublicRoute from "./components/PublicRoute"
import AuthLayout from "./components/AuthLayout"
import MainLayout from "./components/MainLayout"
import SignupPage from "./Pages/SignUpPage"
import HomePage from "./Pages/HomePage"


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
