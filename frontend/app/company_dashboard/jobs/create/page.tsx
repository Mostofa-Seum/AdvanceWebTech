'use client'
import { useState } from "react";
import api from "../../../services/api";
export default function CreateJob() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [deadline, setDeadline] = useState("");
    async function createJob() {
        try {
            const user =
                JSON.parse(
                    localStorage.getItem("user") || "{}"
                )
            await api.post(
                "/company/job",
                {
                    companyName: user.companyName,
                    email: user.email,
                    title,
                    description,
                    budget: Number(budget),
                    deadline
                }
            )
            alert(
                "Job created"
            )
        }
        catch (err) {

            console.log(err)
        }
    }
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Create Job
            </h1>
            <div className="bg-white p-6 rounded">
                <input
                    placeholder="Title"
                    className="border p-2 w-full mb-4"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    className="border p-2 w-full mb-4"
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    placeholder="Budget"
                    className="border p-2 w-full mb-4"
                    onChange={(e) => setBudget(e.target.value)}
                />
                <input
                    type="date"
                    className="border p-2 w-full mb-4"
                    onChange={(e) => setDeadline(e.target.value)}
                />
                <button
                    onClick={createJob}
                    className="bg-indigo-600 text-white px-5 py-2 rounded"
                >
                    Create
                </button>
            </div>
        </div>
    )
}