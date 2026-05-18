'use client'

import { useState, useEffect } from 'react'
import api from '@/app/services/api'

interface Contract {
    jobId: string
    jobTitle: string
    employeeUserId: string
    employeeName: string
}

export default function Payments() {

    const [contracts, setContracts] = useState<Contract[]>([])
    const [selected, setSelected] = useState("")
    const [amount, setAmount] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        async function load() {

            try {

                const res =
                    await api.get(
                        "/company/completed-contracts"
                    )

                setContracts(res.data)

            } catch (err) {

                console.log(err)

            } finally {
                setLoading(false)
            }
        }

        load()

    }, [])

    async function submit() {

        const user =
            JSON.parse(
                localStorage.getItem("user")
                || "{}"
            )

        const [
            employeeUserId,
            jobId
        ] = selected.split("|")

        try {

            await api.post(
                "/company/payment",
                {
                    companyUserId:
                        user.userId,

                    employeeUserId,

                    jobId,

                    amount,

                    method:
                        paymentMethod
                }
            )

            setMessage(
                "Payment successful"
            )

        } catch (err) {

            console.log(err)
            setMessage("Failed")
        }
    }

    if (loading) {

        return <div>Loading...</div>
    }

    return (

        <div className="p-10">

            <h1 className="text-3xl mb-5">
                Make Payment
            </h1>

            <select
                value={selected}
                onChange={(e) =>
                    setSelected(e.target.value)
                }
                className="border p-2 block mb-3"
            >

                <option value="">
                    Select Employee
                </option>

                {contracts.map(item => (

                    <option
                        key={item.jobId}
                        value={`${item.employeeUserId}|${item.jobId}`}
                    >

                        {item.employeeName}
                        {" - "}
                        {item.jobTitle}

                    </option>

                ))}

            </select>

            <input
                type="number"
                placeholder="Amount"
                onChange={(e) =>
                    setAmount(
                        parseFloat(
                            e.target.value
                        )
                    )
                }
                className="border p-2 block mb-3"
            />

            <input
                placeholder="Method"
                onChange={(e) =>
                    setPaymentMethod(
                        e.target.value
                    )
                }
                className="border p-2 block mb-3"
            />

            <button
                onClick={submit}
                className="bg-indigo-600 text-white p-3 rounded"
            >
                Submit
            </button>

            <div className="mt-3">
                {message}
            </div>

        </div>
    )
}