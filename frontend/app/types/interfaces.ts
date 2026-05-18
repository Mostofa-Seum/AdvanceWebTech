export interface Job {
    jobId: string;
    title: string;
    description: string;
    budget: number;
    deadline: string;
}
export interface User {
    userId: string;
    email: string;
    role: string;
    fullName: string;
}
export interface Employee {
    employeeId: string;
    fullName: string;
}
export interface Review {
    employeeId: string;
    jobId: string;
    rating: number;
    comment: string;
}
export interface Report {
    employeeId: string;
    reason: string;
    details?: string;
    jobId?: string;
}