import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({ activeTab, onTabChange, children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <div className="dashboard-main">
        <Header />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  )
}

