"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FilterPage() {
  const [date, setDate] = useState();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const eventTypes = [
    "Workshop",
    "Conference",
    "Meetup",
    "Webinar",
    "Hackathon",
    "Training",
  ];

  const technologies = [
    "Flutter",
    "Firebase",
    "Cloud",
    "Android",
    "Web",
    "Machine Learning",
    "AR/VR",
    "IoT",
  ];

  const locations = [
    "San Francisco",
    "New York",
    "London",
    "Berlin",
    "Tokyo",
    "Singapore",
    "Remote",
  ];

  const addFilter = (filter) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setDate(undefined);
    setPriceRange([0, 1000]);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Filter Events</h1>
          <Button variant="outline" onClick={clearAllFilters}>
            Clear all filters
          </Button>
        </div>

        {/* Active filters */}
        {selectedFilters.length > 0 && (
          <div className="mb-8">
            <Label className="block mb-2">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter) => (
                <div
                  key={filter}
                  className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
                >
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="hover:text-primary"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-8">
          {/* price , date filter */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Price Range ($)</Label>
              <div className="pt-2">
                <Slider
                  value={priceRange}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{priceRange[0]}</span>
                  <span>{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Type and Format */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select onValueChange={(value) => addFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Event Format</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="in-person">In-person events</Label>
                  <Switch id="in-person" onCheckedChange={() => addFilter("In-person")} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="online">Online events</Label>
                  <Switch id="online" onCheckedChange={() => addFilter("Online")} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hybrid">Hybrid events</Label>
                  <Switch id="hybrid" onCheckedChange={() => addFilter("Hybrid")} />
                </div>
              </div>
            </div>
          </div>

          {/* Technologies,, Location */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Technologies</Label>
              <Select onValueChange={(value) => addFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technology" />
                </SelectTrigger>
                <SelectContent>
                  {technologies.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select onValueChange={(value) => addFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search, Apply */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="Search by keywords..."
              className="flex-1"
              onChange={(e) => e.target.value && addFilter(e.target.value)}
            />
            <Button className="sm:w-32">
              <Filter className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}