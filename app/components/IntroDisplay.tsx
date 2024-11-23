import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Intro, createOrUpdateIntro } from '../../lib/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/hooks/use-toast"
import { Raleway } from 'next/font/google'
import { useAuth } from '@clerk/nextjs'

const raleway = Raleway({ subsets: ['latin'] })

const EditIntroDialog: React.FC<{ intro: Intro | null; onSubmit: (updatedIntro: Intro) => void }> = ({ intro, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string | string[]}>({});
  const { toast } = useToast()

  const validateForm = (formData: FormData) => {
    const newErrors: {[key: string]: string} = {};
    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!summary.trim()) newErrors.summary = 'Summary is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formData: FormData) => {
    if (!validateForm(formData)) return;

    setIsSubmitting(true);
    const result = await createOrUpdateIntro({ message: '', errors: {} }, formData);
    setIsSubmitting(false);
    if (result.message) {
      toast({
        title: "Introduction Updated",
        description: result.message,
      })
      setIsOpen(false);
      if (result.shouldRefresh) {
        window.location.reload();
      }
    } else if (result.errors) {
      const filteredErrors = Object.fromEntries(
        Object.entries(result.errors).filter(([_, v]) => v !== undefined)
      ) as { [key: string]: string | string[] };
      setErrors(filteredErrors);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this introduction?")) {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('action', 'delete');
      const result = await createOrUpdateIntro({ message: '', errors: {} }, formData);
      setIsSubmitting(false);
      if (result.message) {
        toast({
          title: "Introduction Deleted",
          description: result.message,
        });
        setIsOpen(false);
        if (result.shouldRefresh) {
          window.location.reload();
        }
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button  variant="outline">{intro ? 'Edit Introduction' : 'Add Introduction'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-4">
        <DialogHeader>
          <DialogTitle>{intro ? 'Edit Introduction' : 'Add Introduction'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.target as HTMLFormElement)); }} className="space-y-4">
          <div>
            <Input name="name" defaultValue={intro?.name || ''} placeholder="Name" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{Array.isArray(errors.name) ? errors.name[0] : errors.name}</p>}
          </div>
          <div>
            <Input name="title" defaultValue={intro?.title || ''} placeholder="Title" />
            {errors.title && <p className="text-red-500 text-sm mt-1">{Array.isArray(errors.title) ? errors.title[0] : errors.title}</p>}
          </div>
          <div>
            <Textarea name="summary" defaultValue={intro?.summary || ''} placeholder="Summary" />
            {errors.summary && <p className="text-red-500 text-sm mt-1">{Array.isArray(errors.summary) ? errors.summary[0] : errors.summary}</p>}
          </div>
          <Input name="contactEmail" type="email" defaultValue={intro?.contactEmail || undefined} placeholder="Contact Email" />
          <Input name="linkedinUrl" type="url" defaultValue={intro?.linkedinUrl || undefined} placeholder="LinkedIn URL" />
          <Input name="githubUrl" type="url" defaultValue={intro?.githubUrl || undefined} placeholder="GitHub URL" />
          <Input name="profileImageUrl" type="url" defaultValue={intro?.profileImageUrl || undefined} placeholder="Profile Image URL" />
          <div className="flex justify-between">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (intro ? 'Update Introduction' : 'Add Introduction')}
            </Button>
            {intro && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                Delete
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function IntroDisplay({ intro, isLoading }: { intro: Intro | null; isLoading: boolean }) {
  const { userId } = useAuth()
  const isAuthenticated = !!userId

  if (isLoading) {
    return (
      <div className="w-full max-w-[800px] px-4 mx-auto">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <p className="text-sm text-gray-500">Loading introduction...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!intro) {
    return null;
  }

  return (
    <div className="w-full max-w-[800px] px-0 sm:px-4 mx-auto">
      <Card className={`${raleway.className} border-none shadow-sm hover:shadow-md transition-all duration-300 w-full`}>
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-3 sm:gap-4">
            {intro.profileImageUrl && (
              <img 
                src={intro.profileImageUrl} 
                alt={intro.name} 
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-100"
              />
            )}
            <div className="flex-grow space-y-2 sm:space-y-4 text-center sm:text-left">
              <div>
                <p className="text-lg sm:text-xl font-medium text-black">{intro.name}</p>
                <p className="text-base sm:text-lg text-gray-600 mt-1">{intro.title}</p>
              </div>
              <p className="text-xs sm:text-base text-gray-600 leading-relaxed">{intro.summary}</p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 pt-2 sm:pt-4">
                {intro.contactEmail && (
                  <a 
                    href={`mailto:${intro.contactEmail}`}
                    className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-black transition-colors"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span className="hover:underline">Email</span>
                  </a>
                )}
                {intro.linkedinUrl && (
                  <a 
                    href={intro.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-black transition-colors"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span className="hover:underline">LinkedIn</span>
                  </a>
                )}
                {intro.githubUrl && (
                  <a 
                    href={intro.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-black transition-colors"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="hover:underline">GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="mt-6 sm:mt-8 flex justify-center sm:justify-end">
              <EditIntroDialog 
                intro={intro} 
                onSubmit={() => {}}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}