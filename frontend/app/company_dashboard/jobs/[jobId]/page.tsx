'use client'
import { useState, useEffect } from "react";
import api from "../../../services/api";
import { useParams, useRouter } from "next/navigation";
export default function JobDetails() {
    const { jobId } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>({});
    const [title, setTitle] = useState("");
    useEffect(() => {
        load()
    }, [])
    async function load() {
        const user =
            JSON.parse(
                localStorage.getItem("user") || "{}"
            )
        const res =
            await api.get(
                `/company/job/search?companyName=${user.companyName}`
            )
        const found =
            res.data.jobs.find(
                (j: any) => j.jobId === jobId
            )
        setJob(found)
        setTitle(found.title)
    }
    async function updateJob() {
        const user =
            JSON.parse(
                localStorage.getItem("user") || "{}"
            )
        await api.put(
            `/company/job/edit/${jobId}?companyName=${user.companyName}`,
            {
                title
            }
        )
        alert(
            "Updated"
        )
    }
    async function removeJob() {
        const user =
            JSON.parse(
                localStorage.getItem("user") || "{}"
            )
        await api.delete(
            `/company/job/remove/${jobId}?companyName=${user.companyName}`
        )
        router.push(
            "/company_dashboard/jobs"
        )
    }
    return (
        <div>
            <h1 className="text-2xl font-bold mb-5">
                Edit Job
            </h1>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 w-full mb-4"
            />
            <button
                onClick={updateJob}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-3"
            >
                Update
            </button>
            <button
                onClick={removeJob}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Delete
            </button>
        </div>
    )
}