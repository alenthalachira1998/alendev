import React, { Suspense } from 'react';
import { loadExperiences } from '../../lib/actions';
import JobExperienceCRUD from '../components/ExperienceList';
import { auth } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';


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
  try {
    const session = await auth();

    if (!session || !session.user) {
      console.log('No session found, redirecting to login');
      redirect('/auth/login');
    }

    console.log('Session found, user authenticated:', session.user.email);

    return (
  
      <Suspense fallback={<Loader />}>
    
        <ExperienceList />
      </Suspense>
     
    );
  } catch (error) {
    console.error('Error in authentication:', error);
    redirect('/auth/login');
  }
}