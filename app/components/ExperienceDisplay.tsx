'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { JobExperience, deleteExperience, loadExperiences } from '../../lib/actions'
import { Raleway } from 'next/font/google'
import { CalendarIcon, BriefcaseIcon, ClockIcon } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { useToast } from "@/components/hooks/use-toast"
import ExperienceForm from './ExperienceForm'

const raleway = Raleway({ subsets: ['latin'] })

interface ExperienceDisplayProps {
  experiences: JobExperience[];
}

const DeleteExperienceButton: React.FC<{ id: string; onDelete: () => void }> = ({ id, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async (formData: FormData) => {
    setIsDeleting(true)
    await deleteExperience({ message: '', errors: {} }, formData)
    setIsDeleting(false)
    onDelete()
    toast({
      title: "Experience Deleted",
      description: "The experience entry has been successfully deleted.",
    })
  }

  return (
    <form action={handleDelete}>
      <input type="hidden" name="id" value={id} />
      <Button variant="destructive" type="submit" disabled={isDeleting} className="mt-2">
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </form>
  )
}

const AddExperienceDialog: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='text-black' variant="outline">Add Experience</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Experience</DialogTitle>
          <DialogDescription>
            Enter the details of your work experience here.
          </DialogDescription>
        </DialogHeader>
        <ExperienceForm
          onSubmit={() => {
            setIsOpen(false)
            onAdd()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

const ExperienceDisplay: React.FC<ExperienceDisplayProps> = ({ experiences: initialExperiences }) => {
  const { userId } = useAuth()
  const isAuthenticated = !!userId
  const [refreshKey, setRefreshKey] = useState(0)
  const [experiences, setExperiences] = useState(initialExperiences)

  const refreshData = useCallback(() => {
    setRefreshKey(oldKey => oldKey + 1)
  }, [])

  useEffect(() => {
    const fetchExperiences = async () => {
      const data = await loadExperiences()
      setExperiences(data)
    }

    fetchExperiences()
  }, [refreshKey])

  if (!experiences || experiences.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-500">No experience data available.</p>
        {isAuthenticated && (
          <div className="mt-4">
            <AddExperienceDialog onAdd={refreshData} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative max-w-4xl mx-auto px-4 py-8 ${raleway.className}`}>
      {isAuthenticated && (
        <div className="mb-8">
          <AddExperienceDialog onAdd={refreshData} />
        </div>
      )}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2">
        <div className="absolute top-0 left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background transform -translate-x-1/2"></div>
      </div>
      {experiences.map((experience) => (
        <div key={experience.id} className="relative mb-8 group">
          <div className="hidden md:block absolute left-1/2 top-5 w-6 h-6 bg-primary rounded-full transform -translate-x-1/2 border-4 border-background z-10 shadow-md transition-all duration-300 group-hover:scale-110"></div>
          <Card className="md:w-[calc(50%-1rem)] md:even:ml-[calc(50%+1rem)] shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <BriefcaseIcon className="w-4 h-4 text-primary mr-2" />
                <h3 className="text-lg font-semibold">{experience.title}</h3>
              </div>
              <h4 className="text-base text-gray-600 mb-2">{experience.company}</h4>
              <p className="mt-2 text-sm text-gray-700">{experience.description}</p>
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-500">
                <div className="w-full sm:w-auto mb-2 sm:mb-0 flex items-center">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  <p>
                    {new Date(experience.startDate).toLocaleDateString()} - 
                    {new Date(experience.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-full sm:w-auto text-left sm:text-right flex items-center justify-start sm:justify-end">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  <p className="font-semibold text-primary">
                    {((new Date(experience.endDate).getTime() - new Date(experience.startDate).getTime()) / 
                      (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)} years
                  </p>
                </div>
              </div>
              {isAuthenticated && (
                <DeleteExperienceButton id={experience.id} onDelete={refreshData} />
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

export default ExperienceDisplay