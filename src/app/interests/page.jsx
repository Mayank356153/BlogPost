"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Code, Cloud, Database, Smartphone, Globe, Brain, Cpu, Shield, Palette, Notebook as Robot, Bitcoin, Blocks } from "lucide-react";



const interests = [
  {
    id: "web-dev",
    name: "Web Development",
    icon: <Globe className="w-6 h-6" />,
    description: "Frontend, Backend, Full-stack development",
  },
  {
    id: "mobile-dev",
    name: "Mobile Development",
    icon: <Smartphone className="w-6 h-6" />,
    description: "iOS, Android, Cross-platform development",
  },
  {
    id: "cloud",
    name: "Cloud Computing",
    icon: <Cloud className="w-6 h-6" />,
    description: "AWS, Google Cloud, Azure, DevOps",
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    icon: <Brain className="w-6 h-6" />,
    description: "Deep Learning, NLP, Computer Vision",
  },
  {
    id: "data",
    name: "Data Science",
    icon: <Database className="w-6 h-6" />,
    description: "Analytics, Big Data, Data Engineering",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: <Shield className="w-6 h-6" />,
    description: "Security, Penetration Testing, Cryptography",
  },
  {
    id: "blockchain",
    name: "Blockchain",
    icon: <Bitcoin className="w-6 h-6" />,
    description: "Cryptocurrency, Smart Contracts, DApps",
  },
  {
    id: "ui-ux",
    name: "UI/UX Design",
    icon: <Palette className="w-6 h-6" />,
    description: "User Interface, User Experience, Design Systems",
  },
  {
    id: "ar-vr",
    name: "AR/VR",
    icon: <Blocks className="w-6 h-6" />,
    description: "Augmented Reality, Virtual Reality, Mixed Reality",
  },
  {
    id: "iot",
    name: "IoT",
    icon: <Cpu className="w-6 h-6" />,
    description: "Internet of Things, Embedded Systems",
  },
  {
    id: "robotics",
    name: "Robotics",
    icon: <Robot className="w-6 h-6" />,
    description: "Robot Development, Automation",
  },
  {
    id: "programming",
    name: "Programming Languages",
    icon: <Code className="w-6 h-6" />,
    description: "Java, Python, JavaScript, Go, Rust",
  },
];

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const router = useRouter();
  const { toast } = useToast();

  const toggleInterest = (id) => {
    setSelectedInterests(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 5) {
        toast({
          title: "Maximum interests reached",
          description: "You can select up to 5 interests",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSubmit = async () => {
    if (selectedInterests.length < 3) {
      toast({
        title: "Not enough interests selected",
        description: "Please select at least 3 interests",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call


        console.log("Selected Interests:", selectedInterests);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Interests saved",
        description: "Your interests have been updated successfully",
      });
      
    //   router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save interests. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Choose Your Interests</h1>
          <p className="text-muted-foreground">
            Select 3-5 topics that interest you to personalize your experience
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interests.map((interest) => (
            <Card
              key={interest.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedInterests.includes(interest.id)
                  ? "border-primary bg-primary/5"
                  : ""
              }`}
              onClick={() => toggleInterest(interest.id)}
            >
              <div className="flex items-start gap-3">
                <div className="text-primary">{interest.icon}</div>
                <div>
                  <h3 className="font-medium">{interest.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {interest.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 mt-8">
          <p className="text-sm text-muted-foreground">
            Selected {selectedInterests.length} of 5 maximum
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setSelectedInterests([])}>
              Clear All
            </Button>
            <Button onClick={handleSubmit}>
              Save Interests
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}