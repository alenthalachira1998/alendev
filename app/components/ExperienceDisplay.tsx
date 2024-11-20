import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { JobExperience } from '../../lib/actions'
import { Raleway } from 'next/font/google'
import { CalendarIcon, BriefcaseIcon, ClockIcon } from 'lucide-react'

const raleway = Raleway({ subsets: ['latin'] })

const calculateYearsOfExperience = (startDate: string, endDate: string): string => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const differenceInMilliseconds = end.getTime() - start.getTime()
  const years = differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25)
  return years.toFixed(1)
}

export default function ExperienceDisplay({ experiences }: { experiences: JobExperience[] }) {
  if (!experiences || experiences.length === 0) {
    return <p className="text-center text-gray-500">No experience data available.</p>
  }

  return (
    <div className={`relative max-w-4xl mx-auto px-4 py-8 ${raleway.className}`}>
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2">
        <div className="absolute top-0 left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background transform -translate-x-1/2"></div>
      </div>
      {experiences.map((experience, index) => (
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
                    {new Date(experience.startDate).toLocaleDateString()} - {new Date(experience.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-full sm:w-auto text-left sm:text-right flex items-center justify-start sm:justify-end">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  <p className="font-semibold text-primary">
                    {calculateYearsOfExperience(experience.startDate, experience.endDate)} years
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}