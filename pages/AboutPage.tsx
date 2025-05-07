import { Button } from '@/components/ui/button'

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About The Fixer Initiative</h1>
        
        <div className="prose dark:prose-invert">
          <p className="text-lg mb-4">
            The Fixer Initiative was founded with a simple mission: to identify problems
            and provide elegant solutions that make a real difference in people's lives.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
          <p className="mb-4">
            We envision a world where technical obstacles don't stand in the way of progress.
            By creating intuitive tools and services, we help individuals and organizations overcome
            challenges and achieve their goals more efficiently.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p className="mb-4">
            Our diverse team brings together experts from various fields, united by a 
            passion for problem-solving and innovation. From developers to designers, 
            every member contributes unique insights to our collective mission.
          </p>
          
          <div className="mt-8 flex justify-center">
            <Button>Join Our Team</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage

