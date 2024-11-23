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
    <div className={`w-full max-w-[800px] px-0 sm:px-4 mx-auto ${raleway.className}`}>
      {isAuthenticated && (
        <div className="mb-4">
          <AddExperienceDialog onAdd={refreshData} />
        </div>
      )}
      
      {experiences.map((experience) => (
        <div key={experience.id} className="mb-4 w-full">
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 w-full">
            <CardContent className="p-3">
              <div className="flex items-center mb-2">
                <BriefcaseIcon className="w-4 h-4 text-primary mr-2" />
                <h3 className="text-base font-medium">{experience.title}</h3>
              </div>
              <h4 className="text-sm text-gray-600 mb-2">{experience.company}</h4>
              <p className="text-xs text-gray-700 leading-relaxed">{experience.description}</p>
              <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-gray-500">
                <div className="w-full sm:w-auto mb-2 sm:mb-0 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <p>{new Date(experience.startDate).toLocaleDateString()} - {new Date(experience.endDate).toLocaleDateString()}</p>
                </div>
                <div className="w-full sm:w-auto text-left sm:text-right flex items-center justify-start sm:justify-end">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  <p className="font-semibold text-primary text-xs">
                    {((new Date(experience.endDate).getTime() - new Date(experience.startDate).getTime()) / 
                      (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)} years
                  </p>
                </div>
              </div>
              {isAuthenticated && (
                <div className="mt-3">
                  <DeleteExperienceButton id={experience.id} onDelete={refreshData} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ExperienceDisplay;