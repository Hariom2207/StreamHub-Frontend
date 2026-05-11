// Main content wrapper — Navbar ke neeche, Sidebar ke right
export const PageContainer = ({ children, className = '' }) => (
  <main className={`flex-1 overflow-y-auto p-4 md:p-6 ${className}`}>
    {children}
  </main>
)