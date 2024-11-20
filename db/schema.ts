import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  timestamp,
  integer,
  jsonb
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// ... (other table definitions)

export const jobExperiences = pgTable('job_experiences', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
})

// File: db/schema.ts
// File: db/schema.ts

export const users = pgTable('users', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  password: varchar('password', { length: 255 }),
  image: text('image'),
});

export type User = typeof users.$inferSelect;
export type JobExperience = typeof jobExperiences.$inferSelect
export type NewJobExperience = typeof jobExperiences.$inferInsert

export const education = pgTable('education', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
  institution: varchar('institution', { length: 255 }).notNull(),
  degree: varchar('degree', { length: 255 }).notNull(),
  fieldOfStudy: varchar('field_of_study', { length: 255 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  description: text('description'),
  grade: varchar('grade', { length: 50 }),
})

export const techStack = pgTable('tech_stack', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  proficiencyLevel: integer('proficiency_level').notNull(),
  yearsOfExperience: integer('years_of_experience').notNull(),
})

export const projects = pgTable('projects', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  technologies: jsonb('technologies').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  githubUrl: varchar('github_url', { length: 255 }),
  liveUrl: varchar('live_url', { length: 255 }),
  imageUrl: varchar('image_url', { length: 255 }),
})

export const intro = pgTable('intro', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  summary: text('summary').notNull(),
  profileImageUrl: varchar('profile_image_url', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  linkedinUrl: varchar('linkedin_url', { length: 255 }),
  githubUrl: varchar('github_url', { length: 255 }),
})

// Type definitions
export type Education = typeof education.$inferSelect
export type NewEducation = typeof education.$inferInsert

export type TechStack = typeof techStack.$inferSelect
export type NewTechStack = typeof techStack.$inferInsert

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

export type Intro = typeof intro.$inferSelect
export type NewIntro = typeof intro.$inferInsert