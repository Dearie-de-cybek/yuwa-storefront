import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
