'use client'
import { useState, useEffect } from 'react'
import api from '@/app/services/api'

interface Contract {
    jobId: string;
    jobTitle: string;
    employeeUserId: string;
    employeeId: string;
    employeeName: string;
}

export default function Review() {
    const [contracts, setContracts] = useState<Contract[]>([])
    const [selectedContract, setSelectedContract] = useState("")
    const [rating, setRating] = useState(1)
    const [comment, setComment] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function fetchContractsData() {
            try {
                const res = await api.get('/company/completed-contracts')
                setContracts(res.data || [])
            } catch (err) {
                console.error("Could not fetch eligible review targets", err)
            } finally {
                setLoading(false)
            }
        }
        fetchContractsData()
    }, [])

    async function submit() {

        const user =
            JSON.parse(
                localStorage.getItem("user")
                || "{}"
            )

        const [
            employeeId,
            jobId
        ] = selectedContract.split('|')

        try {

            await api.post(
                '/company/review/employee',
                {
                    companyUserId: user.userId,
                    employeeId,
                    jobId,
                    rating,
                    comment
                }
            )

            setMessage(
                "Review submitted"
            )

        } catch (err) {

            console.log(err)
            setMessage("Failed")

        }
    }

    if (loading) {
        return <div className="p-10">Loading active hires from server...</div>
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl mb-5">
                Review Employee
            </h1>

            <select
                className="border p-2 block mb-3 bg-white text-black text-sm"
                value={selectedContract}
                onChange={(e) => setSelectedContract(e.target.value)}
            >
                <option value="">Select Employee</option>
                {contracts.map((item) => (
                    <option
                        key={`${item.employeeUserId}-${item.jobId}`}
                        value={`${item.employeeId}|${item.jobId}`}
                    >
                        {item.employeeName} — {item.jobTitle}
                    </option>
                ))}
            </select>

            <input
                type="number"
                min={0}
                max={5}
                value={rating}
                placeholder="Rating (0-5)"
                className="border p-2 block mb-3"
                onChange={(e) => setRating(parseInt(e.target.value, 10) || 0)}
            />

            <textarea
                placeholder="Comment"
                className="border p-2 block mb-3"
                onChange={(e) => setComment(e.target.value)}
            />
            <button
                onClick={submit}
                className="bg-indigo-600 p-3 rounded text-white"
            >
                Submit
            </button>
            <div className="mt-3">
                {message}
            </div>
        </div>
    )
}