import React, { useState } from 'react';
import { TechStack, createTechStack, deleteTechStack } from '../../lib/actions';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/hooks/use-toast"
import { useAuth } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Raleway } from 'next/font/google';
import { SignedIn } from '@clerk/nextjs';

const raleway = Raleway({ subsets: ['latin'] });

interface TechStackDisplayProps {
  techStack: TechStack[];
  onUpdate: () => void;
}

const TechStackDisplay: React.FC<TechStackDisplayProps> = ({ techStack, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newTechStack, setNewTechStack] = useState({ 
    name: '', 
    category: '', 
    proficiencyLevel: '' 
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const { toast } = useToast()
  const { userId } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string[] } = {};
    
    if (!newTechStack.name.trim()) newErrors.name = ['Name is required'];
    if (!newTechStack.category.trim()) newErrors.category = ['Category is required'];
    if (!newTechStack.proficiencyLevel.trim()) newErrors.proficiencyLevel = ['Proficiency level is required'];
    else if (isNaN(parseInt(newTechStack.proficiencyLevel)) || 
             parseInt(newTechStack.proficiencyLevel) < 1 || 
             parseInt(newTechStack.proficiencyLevel) > 10) {
      newErrors.proficiencyLevel = ['Proficiency level must be a number between 1 and 10'];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setErrors({});
      
      const formData = new FormData();
      formData.append('name', newTechStack.name.trim());
      formData.append('category', newTechStack.category.trim());
      formData.append('proficiencyLevel', newTechStack.proficiencyLevel.trim());
      
      console.log('Sending data:', Object.fromEntries(formData));
      
      const result = await createTechStack({ message: '', errors: {} }, formData);
      
      if (result.message) {
        toast({
          title: "Success",
          description: result.message,
        });
        setNewTechStack({ name: '', category: '', proficiencyLevel: '' });
        onUpdate();
      } else if (result.errors) {
        console.log('Received errors:', result.errors);
        setErrors(Object.fromEntries(
          Object.entries(result.errors)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, value as string[]])
        ));
        toast({
          title: "Error",
          description: result.errors.form?.[0] || "Failed to add tech stack",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleAdd:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const formData = new FormData();
      formData.append('id', id);
      
      const result = await deleteTechStack({ message: '', errors: {} }, formData);
      
      if (result.message) {
        toast({
          title: "Success",
          description: result.message,
        });
        onUpdate();
      } else if (result.errors?.form) {
        toast({
          title: "Error",
          description: result.errors.form[0],
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting tech stack:', error);
      toast({
        title: "Error",
        description: "Failed to delete tech stack",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Add null check and default to empty array
  const safeTechStack = Array.isArray(techStack) ? techStack : [];
  console.log('Production Debug - techStack:', { 
    original: techStack,
    isArray: Array.isArray(techStack),
    length: safeTechStack.length 
  });

  // Use safeTechStack instead of techStack
  const groupedTechStack = safeTechStack.reduce((acc, tech) => {
    if (!tech?.category) return acc; // Skip if category is missing
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as { [key: string]: TechStack[] });

  return (
    <div className={`w-full max-w-[800px] px-0 sm:px-4 mx-auto space-y-4 ${raleway.className}`}>
      <SignedIn>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4 bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
              Add Tech Stack
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Tech Stack</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.entries(newTechStack).map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor={key} className="text-right capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
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
              <Button onClick={handleAdd} disabled={isLoading} className="bg-white text-black hover:bg-gray-100">
                {isLoading ? 'Adding...' : 'Add Tech Stack'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SignedIn>

      <div className="space-y-4 w-full">
        {Object.entries(groupedTechStack).map(([category, techs]) => (
          <Card 
            key={category} 
            className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 w-full"
          >
            <CardHeader className="border-b bg-gray-50 p-3">
              <CardTitle className="text-xs font-medium uppercase tracking-wide">
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 p-3">
              {techs.map((tech) => (
                <div key={tech.id} className="group relative py-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs font-medium">{tech.name}</h3>
                    <span className="text-[10px] text-gray-500 tabular-nums">
                      {tech.proficiencyLevel}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                    <div 
                      className={`${getColorClass(tech.proficiencyLevel)} h-1 rounded-full transition-all duration-500 ease-in-out`}
                      style={{ width: `${(tech.proficiencyLevel / 10) * 100}%` }}
                    />
                  </div>
                  <SignedIn>
                    <div className="absolute right-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        onClick={() => handleDelete(tech.id)} 
                        disabled={deletingId === tech.id} 
                        variant="destructive" 
                        size="sm"
                        className="h-7 text-xs px-3"
                      >
                        {deletingId === tech.id ? '...' : 'Delete'}
                      </Button>
                    </div>
                  </SignedIn>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const getColorClass = (level: number) => {
  if (level >= 8) return 'bg-black';
  if (level >= 5) return 'bg-gray-700';
  return 'bg-gray-500';
};

export default TechStackDisplay;