import React, { useState } from 'react';
import { ChurchProvider, useChurch } from './context/ChurchContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DailyVerseBanner } from './components/DailyVerseBanner';
import { HistorySection } from './components/HistorySection';
import { WeeklyScheduleSection } from './components/WeeklyScheduleSection';
import { EventsSection } from './components/EventsSection';
import { MediaGallerySection } from './components/MediaGallerySection';
import { GivingSection } from './components/GivingSection';
import { PrayerRequestSection } from './components/PrayerRequestSection';
import { ChurchLocationSection } from './components/ChurchLocationSection';
import { Footer } from './components/Footer';
import { EventRegistrationModal } from './components/EventRegistrationModal';
import { MediaViewerModal } from './components/MediaViewerModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { ChurchEvent, MediaItem } from './types';

const ChurchAppContent: React.FC = () => {
  const { adminSession } = useChurch();
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Public interactive modals
  const [selectedEventForReg, setSelectedEventForReg] = useState<ChurchEvent | null>(null);
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);

  const handleNavigate = (sectionId: string) => {
    if (isAdminView) {
      setIsAdminView(false);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAdminTrigger = () => {
    if (adminSession) {
      setIsAdminView(true);
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  if (isAdminView && adminSession) {
    return (
      <AdminLayout onBackToPublicSite={() => setIsAdminView(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Sticky Navigation */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenAdminLogin={handleAdminTrigger}
      />

      {/* Main Public Experience */}
      <main className="flex-1">
        <HeroBanner
          onNavigate={handleNavigate}
          onSelectEvent={(evt) => setSelectedEventForReg(evt)}
        />

        <DailyVerseBanner />

        <HistorySection />

        <WeeklyScheduleSection />

        <EventsSection
          onSelectEventForRegistration={(evt) => setSelectedEventForReg(evt)}
        />

        <MediaGallerySection
          onSelectMedia={(item) => setSelectedMediaItem(item)}
        />

        <GivingSection />

        <PrayerRequestSection />

        <ChurchLocationSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdminLogin={handleAdminTrigger}
        onNavigate={handleNavigate}
      />

      {/* Event Registration Modal */}
      {selectedEventForReg && (
        <EventRegistrationModal
          event={selectedEventForReg}
          onClose={() => setSelectedEventForReg(null)}
        />
      )}

      {/* Media Lightbox Viewer Modal */}
      {selectedMediaItem && (
        <MediaViewerModal
          item={selectedMediaItem}
          onClose={() => setSelectedMediaItem(null)}
        />
      )}

      {/* Admin Login Modal (Hidden Entrance) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={() => setIsAdminView(true)}
      />

    </div>
  );
};

export default function App() {
  return (
    <ChurchProvider>
      <ChurchAppContent />
    </ChurchProvider>
  );
}
