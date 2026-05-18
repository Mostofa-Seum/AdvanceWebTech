import Header from '@/app/components/header'
import Footer from '@/app/components/footer'
import {
  RocketLaunchIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Real-World Tasks',
    description: 'Work on actual projects from tech startups and established companies that need quick, professional results.',
    icon: RocketLaunchIcon,
  },
  {
    name: 'Verified Experience',
    description: 'Every completed task goes on your digital profile with employer feedback, proving your skills to future recruiters.',
    icon: DocumentCheckIcon,
  },
  {
    name: 'No Barrier to Entry',
    description: 'We believe in potential. Apply for projects based on your skills and enthusiasm, not just your past resume.',
    icon: UserGroupIcon,
  },
]

const services = [
  {
    title: 'For Students',
    desc: 'Access micro-internships ranging from 10 to 40 hours. Build your portfolio while getting paid and earning certificates of completion.',
    icon: AcademicCapIcon
  },
  {
    title: 'For Employers',
    desc: 'Scale your team instantly with pre-vetted, ambitious talent ready to tackle specific technical tasks and projects.',
    icon: BriefcaseIcon
  },
  {
    title: 'Skill Analytics',
    desc: 'Get data-driven insights into your performance and see how you stack up against industry standards in real-time.',
    icon: PresentationChartLineIcon
  }
]

export default function Example() {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors scroll-smooth">
      <Header />
      <section id="home" className="relative isolate px-6 pt-14 lg:px-8 min-h-screen flex flex-col justify-center">
        <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>

        <div className="mx-auto max-w-2xl py-20 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
              Your Career Starts With a Single Task
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
              No experience? No problem. <br /> Connect with real companies, complete bite-sized projects, and build a resume that stands out.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="/login" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400">
                Get started
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-800/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-start">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400">Our Mission</h2>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Bridging the Gap Between Learning and Earning</p>
              <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-400">
                SkillSeed was founded to solve the &quot;entry-level experience&quot; paradox. We empower students by turning professional tasks into accessible learning opportunities.
              </p>
              <div className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 dark:text-gray-400 lg:max-w-none">
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900 dark:text-white">Built by students, for students.</dt>
                  <dd className="inline"> We understand the struggle of landing that first job. Our platform focuses on skill-based hiring, allowing your work to speak for itself.</dd>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center lg:pt-4">
              <div className="bg-indigo-600/5 dark:bg-indigo-500/10 p-8 rounded-2xl border border-indigo-600/10 dark:border-indigo-500/20">
                <PresentationChartLineIcon className="h-48 w-48 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
        </div>
      </section>


      <section id="services" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400">What We Offer</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Bite-sized opportunities, massive impact</p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="flex flex-col bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500">
                    <service.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <dt className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                    {service.title}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                    <p className="flex-auto">{service.desc}</p>
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}