import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (<>
  <h1> Hello</h1>
  <p>Welcome to my website</p>
  <Link href="/about"> About Us </Link>
  <Link href="/product"> Products </Link>

  <Image src="/images/globe.svg" alt="Logo" width={100} height={100} />
  </>
  );
}
