'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { createExperience, updateExperience } from '../../lib/actions'
import { JobExperience } from '@/lib/actions'

const jobExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
})

interface ExperienceFormProps {
  experience?: JobExperience | null
  onSubmit: () => void
}

export default function ExperienceForm({ experience = null, onSubmit }: ExperienceFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [errors, setErrors] = useState<{ [key: string]: string | string[] | undefined }>({})

  const form = useForm<z.infer<typeof jobExperienceSchema>>({
    resolver: zodResolver(jobExperienceSchema),
    defaultValues: {
      company: experience?.company || '',
      title: experience?.title || '',
      description: experience?.description || '',
      startDate: experience?.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
      endDate: experience?.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
    },
  })

  const handleSubmit = async (data: z.infer<typeof jobExperienceSchema>) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
      
      if (experience?.id) {
        formData.append('id', experience.id)
      }
      
      const action = experience ? updateExperience : createExperience
      const result = await action({ message: '', errors: {} }, formData)

      if (result.message) {
        toast({
          title: experience ? 'Experience Updated' : 'Experience Added',
          description: result.message,
        })
        onSubmit()
      } else if (result.errors) {
        setErrors(result.errors)
        Object.entries(result.errors).forEach(([key, error]) => {
          if (key === 'form') {
            toast({
              title: 'Error',
              description: Array.isArray(error) ? error[0] : error,
              variant: 'destructive',
            })
          }
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while saving the experience',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                <Textarea 
                  placeholder="Enter job description" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                  />
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
                  <Input
                    type="date"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            experience ? 'Update Experience' : 'Add Experience'
          )}
        </Button>
      </form>
    </Form>
  )
}
