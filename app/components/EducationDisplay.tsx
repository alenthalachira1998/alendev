import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Education, deleteEducation, createEducation, loadEducation } from '../../lib/actions';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Raleway } from 'next/font/google'
import { CalendarIcon, BookOpenIcon, GraduationCapIcon } from 'lucide-react'

const raleway = Raleway({ subsets: ['latin'] })

const DeleteEducationButton: React.FC<{ id: string; onDelete: () => void }> = ({ id, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast()

  const handleDelete = async (formData: FormData) => {
    setIsDeleting(true);
    await deleteEducation({ message: '', errors: {} }, formData);
    setIsDeleting(false);
    onDelete();
    toast({
      title: "Education is  Deleted",
      description: "The education entry has been successfully removed.",
    })
  };

  return (
    <form action={handleDelete}>
      <input type="hidden" name="id" value={id} />
      <Button variant="destructive" type="submit" disabled={isDeleting} className="mt-2">
        {isDeleting ? 'Deleting....' : 'Delete'}
      </Button>
    </form>
  );
};

const AddEducationDialog: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | string[] }>({});
  const { toast } = useToast()

  const validateForm = (formData: FormData): boolean => {
    const newErrors: { [key: string]: string } = {};
    const requiredFields = ['institution', 'degree', 'fieldOfStudy', 'startDate', 'endDate', 'description'];
    
    requiredFields.forEach(field => {
      if (!formData.get(field)) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    if (endDate < startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (formData: FormData) => {
    if (!validateForm(formData)) return;

    setIsAdding(true);
    const result = await createEducation({ message: '', errors: {} }, formData);
    setIsAdding(false);
    
    if (result.message) {
      setIsOpen(false);
      onAdd();
      toast({
        title: "Education Added",
        description: result.message,
      });
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='text-black' variant="outline">Add Education</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Education</DialogTitle>
          <DialogDescription>
            Enter the details of your educational experience here.
          </DialogDescription>
        </DialogHeader>
        <form action={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                name="institution"
                className={errors.institution ? 'border-red-500' : ''}
              />
              {errors.institution && <p className="text-sm text-red-500">{errors.institution}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                name="degree"
                className={errors.degree ? 'border-red-500' : ''}
              />
              {errors.degree && <p className="text-sm text-red-500">{errors.degree}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="fieldOfStudy">Field of Study</Label>
            <Input
              id="fieldOfStudy"
              name="fieldOfStudy"
              className={errors.fieldOfStudy ? 'border-red-500' : ''}
            />
            {errors.fieldOfStudy && <p className="text-sm text-red-500">{errors.fieldOfStudy}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              name="grade"
              className={errors.grade ? 'border-red-500' : ''}
            />
            {errors.grade && <p className="text-sm text-red-500">{errors.grade}</p>}
          </div>
          <Button type="submit" disabled={isAdding}>
            {isAdding ? 'Adding...' : 'Add Education'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EducationDisplay: React.FC = () => {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [educations, setEducations] = useState<Education[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshKey(oldKey => oldKey + 1);
  }, []);

  useEffect(() => {
    const fetchEducations = async () => {
      const data = await loadEducation();
      setEducations(data);
    };

    fetchEducations();
  }, [refreshKey]);

  return (
    <div className={`relative max-w-4xl mx-auto px-4 py-8 ${raleway.className}`}>
      {isAuthenticated && (
        <div className="mb-8">
          <AddEducationDialog onAdd={refreshData} />
        </div>
      )}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2">
        <div className="absolute top-0 left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background transform -translate-x-1/2"></div>
      </div>
      {educations.map((edu, index) => (
        <div key={edu.id} className="relative mb-8 group">
          <div className="hidden md:block absolute left-1/2 top-5 w-6 h-6 bg-primary rounded-full transform -translate-x-1/2 border-4 border-background z-10 shadow-md transition-all duration-300 group-hover:scale-110"></div>
          <Card className="md:w-[calc(50%-1rem)] md:even:ml-[calc(50%+1rem)] shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <GraduationCapIcon className="w-4 h-4 text-primary mr-2" />
                <h3 className="text-lg font-semibold">{edu.degree} in {edu.fieldOfStudy}</h3>
              </div>
              <h4 className="text-base text-gray-600 mb-2">{edu.institution}</h4>
              <p className="mt-2 text-sm text-gray-700">{edu.description}</p>
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-500">
                <div className="w-full sm:w-auto mb-2 sm:mb-0 flex items-center">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  <p>{edu.startDate} - {edu.endDate}</p>
                </div>
                <div className="w-full sm:w-auto text-left sm:text-right flex items-center justify-start sm:justify-end">
                  <BookOpenIcon className="w-3 h-3 mr-1" />
                  <p className="font-semibold text-primary">Grade: {edu.grade}</p>
                </div>
              </div>
              {isAuthenticated && (
                <DeleteEducationButton id={edu.id} onDelete={refreshData} />
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default EducationDisplay;