import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { deleteProject, createProject, loadProjects, updateProject } from '../../lib/actions';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/hooks/use-toast"
import { Raleway } from 'next/font/google';

const raleway = Raleway({ subsets: ['latin'] });

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
}

const DeleteProjectButton: React.FC<{ id: string; onDelete: () => void }> = ({ id, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast()

  const handleDelete = async (formData: FormData) => {
    setIsDeleting(true);
    await deleteProject({ message: '', errors: {} }, formData);
    setIsDeleting(false);
    onDelete();
    toast({
      title: "Project Deleted",
      description: "The project has been successfully removed.",
    })
  };

  return (
    <form action={handleDelete}>
      <input type="hidden" name="id" value={id} />
      <Button 
        variant="destructive" 
        type="submit" 
        disabled={isDeleting}
        size="sm"
        className="h-7 text-xs"
      >
        {isDeleting ? '...' : 'Delete'}
      </Button>
    </form>
  );
};

const AddEditProjectDialog: React.FC<{ project?: Project | null; onSubmit: () => void }> = ({ project, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string | string[] | undefined}>({});
  const { toast } = useToast()

  const validateForm = (formData: FormData) => {
    const newErrors: {[key: string]: string} = {};
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const technologies = formData.get('technologies') as string;
    const startDate = formData.get('startDate') as string;

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!technologies.trim()) newErrors.technologies = 'At least one technology is required';
    if (!startDate) newErrors.startDate = 'Start date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formData: FormData) => {
    if (!validateForm(formData)) return;

    setIsSubmitting(true);
    const action = project ? updateProject : createProject;
    if (project) formData.append('id', project.id);
    const result = await action({ message: '', errors: {} }, formData);
    setIsSubmitting(false);
    if (result.message) {
      toast({
        title: project ? "Project Updated" : "Project Added",
        description: result.message,
      })
      setIsOpen(false);
      onSubmit();
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button  className =" text-white bg-black" variant="outline">{project ? 'Edit Project' : 'Add Project'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add Project'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Input name="title" defaultValue={project?.title} placeholder="Project Title" />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <Textarea name="description" defaultValue={project?.description} placeholder="Description" />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div>
            <Input name="technologies" defaultValue={project?.technologies.join(', ')} placeholder="Technologies (comma-separated)" />
            {errors.technologies && <p className="text-red-500 text-sm mt-1">{errors.technologies}</p>}
          </div>
          <div>
            <Input name="startDate" type="date" defaultValue={project?.startDate} />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>
          <Input name="endDate" type="date" defaultValue={project?.endDate || undefined} />
          <Input name="githubUrl" type="url" defaultValue={project?.githubUrl || undefined} placeholder="GitHub URL" />
          <Input name="liveUrl" type="url" defaultValue={project?.liveUrl || undefined} placeholder="Live URL" />
          <Input name="imageUrl" type="url" defaultValue={project?.imageUrl || undefined} placeholder="Image URL" />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (project ? 'Update Project' : 'Add Project')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ProjectsDisplayProps {
  projects: Project[];
}

const ProjectsDisplay: React.FC<ProjectsDisplayProps> = ({ projects: initialProjects }) => {
  const { userId } = useAuth();
  const isAuthenticated = !!userId;
  const [refreshKey, setRefreshKey] = useState(0);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(() => {
    setRefreshKey(oldKey => oldKey + 1);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const data = await loadProjects();
      setProjects(data.map(project => ({
        ...project,
        technologies: Array.isArray(project.technologies) ? project.technologies : []
      })));
      setIsLoading(false);
    };

    fetchProjects();
  }, [refreshKey]);

  return (
    <div className={`w-full max-w-[800px] px-0 sm:px-4 mx-auto ${raleway.className}`}>
      {isAuthenticated && (
        <div className="w-full mb-4">
          <AddEditProjectDialog project={null} onSubmit={refreshData} />
        </div>
      )}
      
      {isLoading ? (
        <p>Loading...</p>
      ) : !projects || projects.length === 0 ? (
        <Card className="border-none shadow-sm w-full">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">No projects available.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 w-full">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 w-full">
              <CardHeader className="border-b bg-gray-50 p-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-[10px] mt-0.5">
                      {project.startDate} - {project.endDate || 'Present'}
                    </CardDescription>
                  </div>
                  {isAuthenticated && (
                    <div className="flex gap-2">
                      <AddEditProjectDialog project={project} onSubmit={refreshData} />
                      <DeleteProjectButton id={project.id} onDelete={refreshData} />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {(project.githubUrl || project.liveUrl) && (
                  <div className="flex gap-3 sm:gap-4 pt-2">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-base text-gray-600 hover:text-black transition-colors flex items-center gap-1.5"
                      >
                        GitHub →
                      </a>
                    )}
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-base text-gray-600 hover:text-black transition-colors flex items-center gap-1.5"
                      >
                        Live Demo →
                      </a>
                    )}
                  </div>
                )}

                {project.imageUrl && (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-auto rounded-md sm:rounded-lg mt-3 sm:mt-4 object-cover shadow-sm"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsDisplay;