import React, { Suspense } from 'react';
import { loadExperiences } from '../../lib/actions';
import JobExperienceCRUD from '../components/ExperienceList';

// Custom Loader component
const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

async function ExperienceList() {
  const experiences = await loadExperiences();
  return <JobExperienceCRUD initialExperiences={experiences} />;
}

export default async function JobExperiencePage() {
  return (
    <Suspense fallback={<Loader />}>
      <ExperienceList />
    </Suspense>
  );
}