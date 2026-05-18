'use client'
import Link from "next/link";
interface Props {
  job: any
}
export default function JobCard({
  job
}: Props) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold">
        {job.title}
      </h3>
      <p>
        {job.description}
      </p>
      <p className="mt-2">
        Budget: {job.budget}
      </p>
      <Link
        href={`/company_dashboard/jobs/${job.jobId}`}
        className="text-indigo-600"
      >
        View
      </Link>
    </div>
  )
}