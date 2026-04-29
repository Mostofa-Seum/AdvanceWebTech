import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  return (<>
  <Header />
  <Link href="/about"> About Us </Link>
  <Link href="/product"> Products </Link>
  <Footer />
  </>
  );
}
