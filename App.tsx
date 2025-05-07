import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ChatPage from './pages/ChatPage'
import RootLayout from './layouts/RootLayout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

