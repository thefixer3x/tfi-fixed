import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Welcome to The Fixer Initiative
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Solving problems, one fix at a time.
              </p>
            </div>
            <div className="space-x-4">
              <Link to="/chat">
                <Button className="px-8">
                  Get Started with Chat <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 items-center">
            <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
              <h3 className="text-lg font-bold">Simple</h3>
              <p className="text-sm text-muted-foreground">
                Easy to use interface designed for all skill levels.
              </p>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
              <h3 className="text-lg font-bold">Efficient</h3>
              <p className="text-sm text-muted-foreground">
                Optimized performance for quicker problem resolution.
              </p>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
              <h3 className="text-lg font-bold">Effective</h3>
              <p className="text-sm text-muted-foreground">
                Proven solutions that make a real difference.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

