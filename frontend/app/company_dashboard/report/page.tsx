'use client'
import { useState, useEffect } from 'react'
import api from '@/app/services/api'

interface Contract {
    jobId: string;
    jobTitle: string;
    employeeUserId: string;
    employeeId: string; // add this
    employeeName: string;
}

export default function ReportEmployee() {
    const [contracts, setContracts] = useState<Contract[]>([])
    const [selectedContract, setSelectedContract] = useState("")
    const [reason, setReason] = useState("")
    const [details, setDetails] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchContractsData() {
            try {
                const res = await api.get('/company/completed-contracts')
                setContracts(res.data || [])
            } catch (err) {
                console.error("Could not fetch eligible report targets", err)
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
                '/company/report/employee',
                {
                    companyUserId: user.userId,
                    employeeId,
                    jobId,
                    reason,
                    details
                }
            )

            setMessage("Report submitted")

        } catch (err) {

            console.log(err)
            setMessage("Failed")

        }
    }

    if (loading) {
        return <div className="p-10">Loading active contracts from server...</div>
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl mb-5">
                Report Employee
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
                placeholder="Reason"
                className="border p-2 block mb-3"
                onChange={(e) => setReason(e.target.value)}
            />

            <textarea
                placeholder="Details"
                className="border p-2 block mb-3"
                onChange={(e) => setDetails(e.target.value)}
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