import AnnouncementBar from "@/components/layout/AnnouncementBar.top";
import Navbar from "@/components/layout/Navbar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      {children}
    </>
  );
}