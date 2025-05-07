import { Outlet, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">The Fixer Initiative</div>
          <nav className="flex gap-4">
            <Link to="/">
              <Button variant="ghost" className="text-primary-foreground hover:text-primary-foreground/90">
                Home
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost" className="text-primary-foreground hover:text-primary-foreground/90">
                Chat
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="text-primary-foreground hover:text-primary-foreground/90">
                About
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-8">
        <Outlet />
      </main>
      
      <footer className="bg-muted py-6">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} The Fixer Initiative. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default RootLayout

