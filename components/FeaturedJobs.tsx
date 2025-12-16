import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign } from "lucide-react"

const jobs = [
 
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp",
    location: "Lagos, Nigeria",
    type: "Full-time",
    budget: "$80–120/hr",
    description: "Build and maintain modern web applications with scalable frontend architecture.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Electrician",
    company: "VoltMasters",
    location: "Moscow, Russia",
    type: "Full-time",
    budget: "$30–45/hr",
    description: "Install, maintain, and repair electrical systems in residential and commercial buildings.",
    skills: ["Wiring", "Circuit Troubleshooting", "Safety Compliance", "Blueprint Reading"],
    posted: "1 day ago",
  },
  {
    id: 3,
    title: "Plumber",
    company: "PipePros",
    location: "Johannesburg, South Africa",
    type: "Contract",
    budget: "$35–50/hr",
    description: "Handle plumbing installations, repairs, and maintenance for homes and offices.",
    skills: ["Pipe Fitting", "Leak Detection", "Water Systems", "Safety Standards"],
    posted: "3 days ago",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "Saint Petersburg, Russia",
    type: "Contract",
    budget: "$60–90/hr",
    description: "Redesign product interfaces and improve user experience for web and mobile apps.",
    skills: ["Figma", "Prototyping", "User Research", "Design Systems"],
    posted: "1 day ago",
  },
  {
    id: 5,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Nairobi, Kenya",
    type: "Part-time",
    budget: "$70–100/hr",
    description: "Develop full-stack features for web and mobile applications.",
    skills: ["Node.js", "React", "MongoDB", "AWS"],
    posted: "3 days ago",
  },
  {
    id: 6,
    title: "Digital Marketing Specialist",
    company: "GrowthLab",
    location: "Accra, Ghana",
    type: "Part-time",
    budget: "$50–80/hr",
    description: "Plan and run online campaigns to drive traffic, leads, and conversions.",
    skills: ["SEO", "PPC", "Content Marketing", "Analytics"],
    posted: "2 days ago",
  },
  {
    id: 7,
    title: "Carpenter",
    company: "WoodWorks",
    location: "Kazan, Russia",
    type: "Full-time",
    budget: "$25–40/hr",
    description: "Construct, repair, and install wooden structures and furniture.",
    skills: ["Woodworking", "Blueprint Reading", "Tool Safety", "Finishing"],
    posted: "5 days ago",
  },
  {
    id: 8,
    title: "Content Writer",
    company: "MediaHub",
    location: "Cape Town, South Africa",
    type: "Freelance",
    budget: "$40–60/hr",
    description: "Create engaging content for blogs, social media, and newsletters.",
    skills: ["SEO", "Copywriting", "Content Strategy", "WordPress"],
    posted: "1 week ago",
  },
  {
    id: 9,
    title: "HVAC Technician",
    company: "CoolAir Solutions",
    location: "Saint Petersburg, Russia",
    type: "Full-time",
    budget: "$30–50/hr",
    description: "Install, maintain, and repair heating, ventilation, and air conditioning systems.",
    skills: ["HVAC Systems", "Troubleshooting", "Safety Compliance", "System Maintenance"],
    posted: "2 days ago",
  }


]

export function FeaturedJobs() {
  return (
    <section id="jobs" className="border-b border-border/40 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-sans text-4xl font-bold tracking-tight">Featured Projects</h2>
          <p className="font-sans mt-4 text-lg text-muted-foreground">
            Discover opportunities from companies around the world
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-sans text-xl">{job.title}</CardTitle>
                    <CardDescription className="font-sans mt-1">{job.company}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="font-sans shrink-0">
                    {job.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">{job.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="font-mono border-primary/20 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-mono tabular-nums">{job.budget}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="font-sans">{job.posted}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
