import React, { useState } from 'react';
import { TechStack, createTechStack, deleteTechStack } from '../../lib/actions';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/hooks/use-toast"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Raleway } from 'next/font/google';

const raleway = Raleway({ subsets: ['latin'] });

interface TechStackDisplayProps {
  techStack: TechStack[];
  onUpdate: () => void;
}

const ProficiencyBar: React.FC<{ level: number }> = ({ level }) => {
  const percentage = (level / 10) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
      <div 
        className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const TechStackDisplay: React.FC<TechStackDisplayProps> = ({ techStack, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newTechStack, setNewTechStack] = useState({ name: '', category: '', proficiencyLevel: '', yearsOfExperience: '' });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const { toast } = useToast()
  const { data: session } = useSession()

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string[] } = {};
    
    if (!newTechStack.name.trim()) newErrors.name = ['Name is required'];
    if (!newTechStack.category.trim()) newErrors.category = ['Category is required'];
    if (!newTechStack.proficiencyLevel.trim()) newErrors.proficiencyLevel = ['Proficiency level is required'];
    else if (isNaN(parseInt(newTechStack.proficiencyLevel))) newErrors.proficiencyLevel = ['Proficiency level must be a number'];
    if (!newTechStack.yearsOfExperience.trim()) newErrors.yearsOfExperience = ['Years of experience is required'];
    else if (isNaN(parseInt(newTechStack.yearsOfExperience))) newErrors.yearsOfExperience = ['Years of experience must be a number'];

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    const formData = new FormData();
    Object.entries(newTechStack).forEach(([key, value]) => formData.append(key, value));
    const result = await createTechStack({ message: '', errors: {} }, formData);
    setIsLoading(false);
    if (result.message) {
      toast({
        title: "Tech Stack Added",
        description: result.message,
      })
      setNewTechStack({ name: '', category: '', proficiencyLevel: '', yearsOfExperience: '' });
      onUpdate();
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const formData = new FormData();
    formData.append('id', id);
    const result = await deleteTechStack({ message: '', errors: {} }, formData);
    setIsDeleting(false);
    if (result.message) {
      toast({
        title: "Tech Stack Deleted",
        description: result.message,
      })
      onUpdate();
    } else if (result.errors.form) {
      toast({
        title: "Error",
        description: result.errors.form[0],
        variant: "destructive",
      })
    }
  };

  return (
    <div className={`space-y-4 ${raleway.className}`}>
      {session && (
        <Dialog >
          <DialogTrigger asChild>
            <Button className="mb-4 bg-white text-black">Add Tech Stack</Button>
          </DialogTrigger>
          <DialogContent className="max-w-full sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Tech Stack</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.entries(newTechStack).map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor={key} className="text-right capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                  <div className="col-span-3 space-y-1">
                    <Input
                      id={key}
                      value={value}
                      onChange={(e) => setNewTechStack({ ...newTechStack, [key]: e.target.value })}
                      className={cn(errors[key] && "border-red-500")}
                    />
                    {errors[key] && <p className="text-sm text-red-500">{errors[key][0]}</p>}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={handleAdd} disabled={isLoading} className="bg-white text-black">
                {isLoading ? 'Adding...' : 'Add Tech Stack'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {techStack.map((tech) => (
          <Card key={tech.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tech.name}</CardTitle>
              <CardDescription>{tech.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-2">
                <Label>Proficiency:</Label>
                <ProficiencyBar level={tech.proficiencyLevel} />
                <span className="text-sm text-gray-500">{tech.proficiencyLevel}/10</span>
              </div>
              <p>Experience: {tech.yearsOfExperience} years</p>
            </CardContent>
            <CardFooter className="justify-end">
              {session && (
                <Button onClick={() => handleDelete(tech.id)} disabled={isDeleting} variant="destructive" className="bg-white text-black">
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TechStackDisplay;