import CenteredNavbar from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { MarketingLenis } from "@/components/home/MarketingLenis";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`relative flex flex-col w-full min-h-screen bg-background`}>
      <MarketingLenis>
        <CenteredNavbar />
        <main className="relative w-full flex-1 z-10">{children}</main>
        <Footer />
      </MarketingLenis>
    </div>
  );
}
