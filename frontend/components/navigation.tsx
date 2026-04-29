import Link from "next/link";

export function Navigation() {
    return (
        <>
        <ul>
            <li><Link href="/Registration"> Registration </Link></li>
            <li><Link href="/about"> About Us </Link></li>
            <li><Link href="/product"> Products </Link></li>
            </ul>
        </>
    );
}