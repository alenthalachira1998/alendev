'use server'

import db from '@/db/drizzle'
import { jobExperiences, education, techStack, projects, intro } from '@/db/schema'
import { eq } from 'drizzle-orm'

export type JobExperience = {
  id: string
  company: string
  title: string
  description: string
  startDate: string
  endDate: string
}

export type NewJobExperience = Omit<JobExperience, 'id'>

export type ExperienceFormData = NewJobExperience

export type State = {
  message: string | null
  errors: {
    [key: string]: string[]
  }
}

export async function loadExperiences(): Promise<JobExperience[]> {
  return await db.select().from(jobExperiences)
}

export async function createExperience(prevState: State, formData: FormData): Promise<State> {
  try {
    const data: ExperienceFormData = {
      company: formData.get('company') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    }
    await db.insert(jobExperiences).values(data)
    return { message: 'Experience created successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateExperience(prevState: State, formData: FormData): Promise<State> {
  try {
    const id = formData.get('id') as string
    if (!id) throw new Error('ID is required for update')

    const data: ExperienceFormData = {
      company: formData.get('company') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    }
    await db.update(jobExperiences).set(data).where(eq(jobExperiences.id, id))
    return { message: 'Experience updated successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteExperience(prevState: State, formData: FormData): Promise<State> {
  try {
    const id = formData.get('id') as string
    if (!id) throw new Error('ID is required for deletion')

    await db.delete(jobExperiences).where(eq(jobExperiences.id, id))
    return { message: 'Experience deleted successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

// New types
export type Education = typeof education.$inferSelect
export type NewEducation = typeof education.$inferInsert

export type TechStack = typeof techStack.$inferSelect
export type NewTechStack = typeof techStack.$inferInsert

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

export type Intro = typeof intro.$inferSelect
export type NewIntro = typeof intro.$inferInsert

// Education CRUD operations
export async function loadEducation(): Promise<Education[]> {
  return await db.select().from(education)
}

export async function createEducation(prevState: State, formData: FormData): Promise<State> {
  try {
    const data: NewEducation = {
      institution: formData.get('institution') as string,
      degree: formData.get('degree') as string,
      fieldOfStudy: formData.get('fieldOfStudy') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      description: formData.get('description') as string,
      grade: formData.get('grade') as string,
    }
    await db.insert(education).values(data)
    return { message: 'Education created successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateEducation(prevState: State, formData: FormData): Promise<State> {
  try {
    const id = formData.get('id') as string
    if (!id) throw new Error('ID is required for update')

    const data: NewEducation = {
      institution: formData.get('institution') as string,
      degree: formData.get('degree') as string,
      fieldOfStudy: formData.get('fieldOfStudy') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      description: formData.get('description') as string,
      grade: formData.get('grade') as string,
    }
    await db.update(education).set(data).where(eq(education.id, id))
    return { message: 'Education updated successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteEducation(prevState: State, formData: FormData): Promise<State> {
  try {
  
    const id = formData.get('id') as string
    if (!id) throw new Error('ID is required for deletion')

    await db.delete(education).where(eq(education.id, id))
    return { message: 'Education deleted successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

// Tech Stack CRUD operations
export async function loadTechStack(): Promise<TechStack[]> {
  return await db.select().from(techStack)
}

export async function createTechStack(prevState: State, formData: FormData): Promise<State> {
  try {
  
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const proficiencyLevel = formData.get('proficiencyLevel') as string
    const yearsOfExperience = formData.get('yearsOfExperience') as string

    const errors: { [key: string]: string[] } = {}

    if (!name) errors.name = ['Name is required']
    if (!category) errors.category = ['Category is required']
    if (!proficiencyLevel) errors.proficiencyLevel = ['Proficiency level is required']
    else if (isNaN(parseInt(proficiencyLevel))) errors.proficiencyLevel = ['Proficiency level must be a number']
    if (!yearsOfExperience) errors.yearsOfExperience = ['Years of experience is required']
    else if (isNaN(parseInt(yearsOfExperience))) errors.yearsOfExperience = ['Years of experience must be a number']

    if (Object.keys(errors).length > 0) {
      return { message: null, errors }
    }

    const data: NewTechStack = {
      name,
      category,
      proficiencyLevel: parseInt(proficiencyLevel),
      yearsOfExperience: parseInt(yearsOfExperience),
    }
    await db.insert(techStack).values(data)
    return { message: 'Tech Stack created successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateTechStack(prevState: State, formData: FormData): Promise<State> {
  try {

    const id = formData.get('id') as string
    if (!id) throw new Error('ID is required for update')

    const data: NewTechStack = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      proficiencyLevel: parseInt(formData.get('proficiencyLevel') as string),
      yearsOfExperience: parseInt(formData.get('yearsOfExperience') as string),
    }
    await db.update(techStack).set(data).where(eq(techStack.id, id))
    return { message: 'Tech Stack updated successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteTechStack(prevState: State, formData: FormData): Promise<State> {
  try {
  
    const id = formData.get('id') as string
    if (!id) throw new Error('ID is required for deletion')

    await db.delete(techStack).where(eq(techStack.id, id))
    return { message: 'Tech Stack deleted successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

// Projects CRUD operations
export async function loadProjects(): Promise<Project[]> {
  return await db.select().from(projects)
}

export async function createProject(prevState: State, formData: FormData): Promise<State> {
  try {

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const technologies = formData.get('technologies') as string
    const startDate = formData.get('startDate') as string

    if (!title || !description || !technologies || !startDate) {
      return { 
        message: null, 
        errors: { 
          form: ['All required fields must be filled'] 
        } 
      }
    }

    const data: NewProject = {
      title,
      description,
      technologies: technologies.split(',').map(t => t.trim()),
      startDate,
      endDate: formData.get('endDate') as string || null,
      githubUrl: formData.get('githubUrl') as string || null,
      liveUrl: formData.get('liveUrl') as string || null,
      imageUrl: formData.get('imageUrl') as string || null,
    }
    await db.insert(projects).values(data)
    return { message: 'Project created successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

export async function updateProject(prevState: State, formData: FormData): Promise<State> {
  try {

    const id = formData.get('id') as string
    if (!id) throw new Error('ID is required for update')

    const data: NewProject = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      technologies: (formData.get('technologies') as string).split(',').map(t => t.trim()),
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string || null,
      githubUrl: formData.get('githubUrl') as string || null,
      liveUrl: formData.get('liveUrl') as string || null,
      imageUrl: formData.get('imageUrl') as string || null,
    }
    await db.update(projects).set(data).where(eq(projects.id, id))
    return { message: 'Project updated successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

export async function deleteProject(prevState: State, formData: FormData): Promise<State> {
  try {

    const id = formData.get('id') as string
    if (!id) throw new Error('ID is required for deletion')

    await db.delete(projects).where(eq(projects.id, id))
    return { message: 'Project deleted successfully', errors: {} }
  } catch (error) {
    return handleError(error)
  }
}

// Intro CRUD operations
export async function loadIntro(): Promise<Intro | null> {
  const intros = await db.select().from(intro).limit(1)
  return intros[0] || null
}

export async function createOrUpdateIntro(prevState: State, formData: FormData): Promise<State & { shouldRefresh: boolean }> {
  try {

    const action = formData.get('action') as string

    if (action === 'delete') {
      await db.delete(intro)
      return { message: 'Intro deleted successfully', errors: {}, shouldRefresh: true }
    }

    const data: NewIntro = {
      name: formData.get('name') as string,
      title: formData.get('title') as string,
      summary: formData.get('summary') as string,
      profileImageUrl: formData.get('profileImageUrl') as string,
      contactEmail: formData.get('contactEmail') as string,
      linkedinUrl: formData.get('linkedinUrl') as string,
      githubUrl: formData.get('githubUrl') as string,
    }
    
    const existingIntro = await loadIntro()
    if (existingIntro) {
      await db.update(intro).set(data).where(eq(intro.id, existingIntro.id))
      return { message: 'Intro updated successfully', errors: {}, shouldRefresh: true }
    } else {
      await db.insert(intro).values(data)
      return { message: 'Intro added successfully', errors: {}, shouldRefresh: true }
    }
  } catch (error) {
    return { ...handleError(error), shouldRefresh: false }
  }
}

// Helper function to handle errors
function handleError(error: unknown): State {
  if (error instanceof Error && error.message === 'Unauthorized') {
    return { message: 'Unauthorized', errors: { form: ['You must be logged in to perform this action'] } }
  }
  return { message: 'An errror occurred', errors: { form: [(error as Error).message] } }
}