import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedCategories from '../components/FeaturedCategories';
import HowItWorks from '../components/HowItWorks';
import EventsSection from '../components/EventsSection';
import Testimonials from '../components/Testimonials';
import Shipping from '../components/Shipping';
import FAQ from '../components/FAQ';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedCategories />
      <HowItWorks />
      <EventsSection />
      <Testimonials />
      <Shipping />
      <FAQ />
    </main>
  );
}
