import { jobExperiences } from '../db/schema';

export type JobExperience = typeof jobExperiences.$inferSelect;

export type ExperienceFormData = {
  company: string
  title: string
  description: string
  start_date: string  // Change to string as it comes from form data
  end_date: string    // Change to string as it comes from form data
}

export interface TechStack {
  id: string;
  name: string;
  icon: string;
  category: string; 
  description: string;// Add this line
}

export interface Intro {
  name: string;
  title: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
}