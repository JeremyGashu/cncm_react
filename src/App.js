import { Routes, Route } from "react-router-dom"
import DashboardPage from "./screens/dashboard/Dashboard"
import LoginPage from "./screens/login/Login"


//TODO - Form validation on each form elements
//TODO - Handle Error gracefully on network failure and exceptions


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard/*' element={<DashboardPage />} />

      </Routes>
    </>
  )
}

export default App