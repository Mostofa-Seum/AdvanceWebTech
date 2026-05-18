'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/app/services/api";

interface Applicant {
    applicationId: string;
    employee: {
        employeeId: string;
    };
    employeeUser: {
        fullName: string;
        email: string;
    };
    status: string;
}

export default function Applicants() {
    const params = useParams();
    const jobId = typeof params.jobId === "string" ? params.jobId : "";
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!jobId) return;
        loadApplicants();
    }, [jobId]);

    async function loadApplicants() {
        try {
            const res = await api.get(`/company/job/${jobId}/applicants`);
            setApplicants(res.data.applicants || []);
        } catch (err) {
            console.log(err);
            setApplicants([]);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(
        applicationId: string,
        status: string
    ) {

        try {

            await api.put(
                `/company/application/${applicationId}/status`,
                {
                    status
                }
            );

            // Accepted → update status in UI
            if (status === "accepted") {

                setApplicants(prev =>
                    prev.map(applicant =>
                        applicant.applicationId === applicationId
                            ? {
                                ...applicant,
                                status: "accepted"
                            }
                            : applicant
                    )
                );

            }

            // Rejected → remove from UI
            if (status === "rejected") {

                setApplicants(prev =>
                    prev.filter(
                        applicant =>
                            applicant.applicationId !== applicationId
                    )
                );

            }

        }
        catch (err) {

            console.log(
                "Status update failed",
                err
            );

        }
    }

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 dark:text-black">Applicants</h1>

            {applicants.length === 0 ? (
                <p className="text-gray-500">No applicants found</p>
            ) : (
                <div className="space-y-4">
                    {applicants.map((applicant) => (
                        <div
                            key={applicant.applicationId}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
                        >
                            <div className="mb-4">
                                <p className="text-sm text-gray-500"><strong>Employee ID:</strong> {applicant.employee?.employeeId}</p>
                                <h3 className="text-xl font-bold dark:text-white mt-1">
                                    {applicant.employeeUser?.fullName || "N/A"}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">{applicant.employeeUser?.email || "N/A"}</p>
                            </div>

                            <p className="mb-6">
                                <strong className="dark:text-white">Status:</strong>{" "}
                                <span className={`font-bold ${applicant.status === "accepted" ? "text-green-600" : applicant.status === "rejected" ? "text-red-600" : "text-yellow-500"}`}>
                                    {applicant.status}
                                </span>
                            </p>

                            <div className="flex gap-3">

                                <button
                                    onClick={() =>
                                        updateStatus(
                                            applicant.applicationId,
                                            "accepted"
                                        )
                                    }
                                    disabled={
                                        applicant.status === "accepted"
                                    }
                                    className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                                >
                                    Accept
                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus(
                                            applicant.applicationId,
                                            "rejected"
                                        )
                                    }
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Reject
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}