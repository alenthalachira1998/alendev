'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { createExperience, updateExperience, deleteExperience, JobExperience, State } from '../../lib/actions'
import SideNav from './layouts/sidenav'
import { Raleway } from 'next/font/google';

const raleway = Raleway({ subsets: ['latin'] });

const jobExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
})

const calculateYearsOfExperience = (startDate: string, endDate: string): string => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const differenceInMilliseconds = end.getTime() - start.getTime()
  const years = differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25)
  return years.toFixed(1)
}

export default function ExperienceList({ initialExperiences }: { initialExperiences: JobExperience[] }) {
  const [experiences, setExperiences] = useState<JobExperience[]>(initialExperiences)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const formRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof jobExperienceSchema>>({
    resolver: zodResolver(jobExperienceSchema),
    defaultValues: {
      company: '',
      title: '',
      description: '',
      startDate: '',
      endDate: '',
    },
  })

  useEffect(() => {
    setExperiences(initialExperiences)
  }, [initialExperiences])

  const onSubmit = async (data: z.infer<typeof jobExperienceSchema>) => {
    setIsLoading(true)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => formData.append(key, value))
    
    let result: State
    if (editingId) {
      formData.append('id', editingId)
      result = await updateExperience({} as State, formData)
      if (result.message) {
        setExperiences(prev => prev.map(exp => exp.id === editingId ? { ...exp, ...data, id: editingId } : exp))
      }
    } else {
      result = await createExperience({} as State, formData)
      console.log('Create result:', result) // Debug log
      if (result.message) {
        let newExperience: JobExperience
        if (typeof result.message === 'object' && result.message !== null && 'id' in result.message) {
          newExperience = { ...data, id: (result.message as { id: string }).id }
        } else {
          // If the server doesn't return an id, generate a temporary one
          newExperience = { ...data, id: Date.now().toString() }
        }
        console.log('New experience:', newExperience) // Debug log
        setExperiences(prev => [...prev, newExperience])
      }
    }

    if (result.message) {
      toast({
        title: editingId ? 'Experience Updated' : 'Experience Added',
        description: `Successfully ${editingId ? 'updated' : 'added'} on ${new Date().toLocaleString()}`,
      })
      form.reset()
      setEditingId(null)
    } else if (result.errors) {
      Object.entries(result.errors).forEach(([key, errors]) => {
        errors.forEach(error => form.setError(key as any, { message: error }))
      })
    }
    setIsLoading(false)
  }

  const handleEdit = (experience: JobExperience) => {
    form.reset(experience)
    setEditingId(experience.id)
    // Scroll to the form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('id', id)
    const result = await deleteExperience({} as State, formData)
    if (result.message) {
      setExperiences(prev => prev.filter(exp => exp.id !== id))
      toast({
        title: "Experience Deleted",
        description: `Successfully deleted on ${new Date().toLocaleString()}`,
      })
    } else if (result.errors) {
      toast({
        title: "Error",
        description: result.errors.form?.[0] || "An error occurred while deleting the experience.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  return (
    <div className={`w-full max-w-2xl mx-auto p-4 ${raleway.className}`}>
      <SideNav/>
      <h1 className="text-2xl text-white mb-6 text-center">EXPERIENCE</h1>
      
      <Card className="mb-8" ref={formRef}>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Experience' : 'Add New Experience'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter job description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  editingId ? 'Update Experience' : 'Add Experience'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {experiences.map((experience) => (
          <Card key={experience.id}>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold">{experience.title}</h3>
              <h4 className="text-lg text-gray-600">{experience.company}</h4>
              <p className="mt-2">{experience.description}</p>
              <p className="mt-2 text-sm text-gray-500">
                From: {new Date(experience.startDate).toDateString()} <br />
                To: {new Date(experience.endDate).toDateString()}
              </p>
              <p className="mt-2 text-sm font-semibold text-blue-600">
                Years of Experience: {calculateYearsOfExperience(experience.startDate, experience.endDate)}
              </p>
              <div className="mt-4 space-x-2">
                <Button onClick={() => handleEdit(experience)} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Edit'}
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(experience.id)} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}