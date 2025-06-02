"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useAuth } from "@/components/auth/auth-provider";
import { 
  Briefcase, 
  GraduationCap, 
  Map, 
  Mail, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter
} from "lucide-react";
import { use } from "react";


export function ProfileAbout() {
    const {user}=useAuth();
  // Mock profile data
  const profileData = {
    work: [
      {
        company: "Google Developer Group",
        role: "Community Organizer",
        period: "2023 - Present",
        description: "Organizing tech events and workshops for the developer community."
      },
      {
        company: "TechCorp Inc.",
        role: "Senior Software Engineer",
        period: "2021 - Present",
        description: "Working on cloud infrastructure and developer tools."
      }
    ],
    education: [
      {
        institution: "Stanford University",
        degree: "M.S. Computer Science",
        period: "2018 - 2020"
      },
      {
        institution: "UC Berkeley",
        degree: "B.S. Computer Science",
        period: "2014 - 2018"
      }
    ],
    location: "San Francisco, California",
    contact: "contact@example.com",
    website: "https://example.com",
    social: {
      github: "github.com/demouser",
      linkedin: "linkedin.com/in/demouser",
      twitter: "twitter.com/demouser"
    }
  };

  return (
    <div className="space-y-6">
      {/* Work Experience */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-primary" />
            <CardTitle className="text-lg">Work Experience</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.work.map((work, index) => (
            <div key={index} className="pb-2 pl-4 border-l-2 border-primary/20">
              <h3 className="font-semibold">{work.role}</h3>
              <p className="text-sm text-muted-foreground">{work.company} • {work.period}</p>
              <p className="mt-1 text-sm">{work.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-primary" />
            <CardTitle className="text-lg">Education</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.education.map((edu, index) => (
            <div key={index} className="pb-2 pl-4 border-l-2 border-primary/20">
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-sm text-muted-foreground">{edu.institution} • {edu.period}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center">
            <Map className="w-4 h-4 mr-3 text-muted-foreground" />
            <span>{profileData.location}</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
            <span>{profileData.contact}</span>
          </div>
          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-3 text-muted-foreground" />
            <a href={profileData.website} className="text-primary hover:underline">{profileData.website}</a>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Social Profiles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center">
            <Github className="w-4 h-4 mr-3 text-muted-foreground" />
            <a href={`https://${profileData.social.github}`} className="text-primary hover:underline">{profileData.social.github}</a>
          </div>
          <div className="flex items-center">
            <Linkedin className="w-4 h-4 mr-3 text-muted-foreground" />
            <a href={`https://${profileData.social.linkedin}`} className="text-primary hover:underline">{profileData.social.linkedin}</a>
          </div>
          <div className="flex items-center">
            <Twitter className="w-4 h-4 mr-3 text-muted-foreground" />
            <a href={`https://${profileData.social.twitter}`} className="text-primary hover:underline">{profileData.social.twitter}</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}