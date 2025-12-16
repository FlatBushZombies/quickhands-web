import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign } from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    budget: "$80-120/hr",
    description: "Looking for an experienced React developer to build a modern web application.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "Remote",
    type: "Contract",
    budget: "$60-90/hr",
    description: "Need a creative designer to redesign our SaaS product interface.",
    skills: ["Figma", "UI Design", "Prototyping", "Design Systems"],
    posted: "1 day ago",
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    type: "Part-time",
    budget: "$70-100/hr",
    description: "Join our team to build innovative features for our mobile app.",
    skills: ["Node.js", "React Native", "MongoDB", "AWS"],
    posted: "3 days ago",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Remote",
    type: "Full-time",
    budget: "$90-130/hr",
    description: "Seeking DevOps expert to optimize our cloud infrastructure.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    posted: "5 days ago",
  },
  {
    id: 5,
    title: "Content Writer",
    company: "MediaHub",
    location: "Remote",
    type: "Freelance",
    budget: "$40-60/hr",
    description: "Looking for talented writer to create engaging blog content.",
    skills: ["SEO", "Copywriting", "Content Strategy", "WordPress"],
    posted: "1 week ago",
  },
  {
    id: 6,
    title: "Mobile App Developer",
    company: "AppMakers",
    location: "Remote",
    type: "Contract",
    budget: "$75-110/hr",
    description: "Build a cross-platform mobile app with modern technologies.",
    skills: ["Flutter", "iOS", "Android", "Firebase"],
    posted: "4 days ago",
  },
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
