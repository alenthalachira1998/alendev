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
import { useSession } from "next-auth/react"

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
      setErrors(result.errors);
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
  const { data: session } = useSession()
  const isAuthenticated = !!session

  const onSubmit = (updatedIntro: Intro) => {
    console.log('Updated intro:', updatedIntro);
    // You might want to add logic here to update the parent component's state
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Card className="p-4 max-w-2xl w-full">
          <CardContent className="pt-6">
            <p>Loading introduction...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!intro) {
    return (
      <div className="flex justify-center">
        <Card className="p-4 max-w-2xl w-full">
          <CardContent className="pt-6">
            <p>No introduction available.</p>
            {isAuthenticated && (
              <div className="mt-4">
                <EditIntroDialog intro={null} onSubmit={onSubmit} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Card className={`${raleway.className} p-4 max-w-2xl w-full`}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
            {intro.profileImageUrl && (
              <img src={intro.profileImageUrl} alt={intro.name} className="w-24 h-24 rounded-full flex-shrink-0" />
            )}
            <div className="text-center sm:text-left flex-grow">
              <h2 className="text-2xl   text-black">{intro.name}</h2>
              <h3 className="text-xl text-gray-600">{intro.title}</h3>
              <p className="mt-4 text-sm sm:text-base">{intro.summary}</p>
            </div>
          </div>
          <div className="mt-6 space-y-2 text-sm sm:text-base">
            {intro.contactEmail && (
              <p className="flex flex-col sm:flex-row sm:items-center">
                <strong className="mr-2">Email:</strong>
                <a href={`mailto:${intro.contactEmail}`} className="text-blue-500 hover:underline break-all">{intro.contactEmail}</a>
              </p>
            )}
            {intro.linkedinUrl && (
              <p className="flex flex-col sm:flex-row sm:items-center">
                <strong className="mr-2">LinkedIn:</strong>
                <a href={intro.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">Profile</a>
              </p>
            )}
            {intro.githubUrl && (
              <p className="flex flex-col sm:flex-row sm:items-center">
                <strong className="mr-2">GitHub:</strong>
                <a href={intro.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">Profile</a>
              </p>
            )}
          </div>
          {isAuthenticated && (
            <div className="mt-6">
              <EditIntroDialog intro={intro} onSubmit={onSubmit} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}