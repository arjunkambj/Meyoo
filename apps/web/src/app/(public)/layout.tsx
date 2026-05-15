import CenteredNavbar from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { MarketingLenis } from "@/components/home/MarketingLenis";
import { HomeMotionProvider } from "@/components/home/MotionProvider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`relative flex flex-col w-full min-h-screen bg-background`}>
      <HomeMotionProvider>
        <MarketingLenis>
          <CenteredNavbar />
          <main className="relative w-full flex-1 z-10">{children}</main>
          <Footer />
        </MarketingLenis>
      </HomeMotionProvider>
    </div>
  );
}
