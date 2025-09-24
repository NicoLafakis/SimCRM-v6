import { useState } from 'react'
import ScenarioSelectionPage from './pages/ScenarioSelectionPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyAccountPage from './pages/MyAccountPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import './App.css'

type PageType = 'scenarios' | 'login' | 'register' | 'account' | 'admin'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('scenarios')

  const renderPage = () => {
    switch (currentPage) {
      case 'scenarios':
        return <ScenarioSelectionPage />
      case 'login':
        return <LoginPage />
      case 'register':
        return <RegisterPage />
      case 'account':
        return <MyAccountPage />
      case 'admin':
        return <AdminDashboardPage />
      default:
        return <ScenarioSelectionPage />
    }
  }

  return (
    <div>
      {/* Simple navigation for development */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        zIndex: 1000, 
        background: '#000', 
        color: '#fff', 
        padding: '10px',
        fontSize: '12px'
      }}>
        <strong>Dev Nav:</strong>{' '}
        <button onClick={() => setCurrentPage('scenarios')} style={{ margin: '0 2px', color: currentPage === 'scenarios' ? '#3B82F6' : '#fff' }}>
          Scenarios
        </button>
        <button onClick={() => setCurrentPage('login')} style={{ margin: '0 2px', color: currentPage === 'login' ? '#3B82F6' : '#fff' }}>
          Login
        </button>
        <button onClick={() => setCurrentPage('register')} style={{ margin: '0 2px', color: currentPage === 'register' ? '#3B82F6' : '#fff' }}>
          Register
        </button>
        <button onClick={() => setCurrentPage('account')} style={{ margin: '0 2px', color: currentPage === 'account' ? '#3B82F6' : '#fff' }}>
          Account
        </button>
        <button onClick={() => setCurrentPage('admin')} style={{ margin: '0 2px', color: currentPage === 'admin' ? '#3B82F6' : '#fff' }}>
          Admin
        </button>
      </div>
      {renderPage()}
    </div>
  )
}

export default App
