'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, Briefcase, DollarSign, ChevronDown, Check } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

// --- Custom Dropdown Component to match the image ---
interface CustomSelectProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  icon: React.ElementType
  placeholder: string
}

function CustomSelect({ options, value, onChange, icon: Icon, placeholder }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left rounded-lg border bg-white py-3.5 pl-11 pr-10 text-gray-700 transition-all focus:outline-none 
          ${isOpen ? 'border-[#6D2E55] ring-1 ring-[#6D2E55]' : 'border-gray-200 hover:border-gray-300'}`}
      >
        <Icon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <span className="block truncate">{value || placeholder}</span>
        <ChevronDown className={`absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-lg border border-gray-100 bg-white shadow-xl ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-100">
          <ul className="max-h-60 overflow-auto py-1 custom-scrollbar">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                className={`text-left group relative cursor-pointer select-none py-2.5 pl-4 pr-9 text-sm outline-none hover:bg-gray-50
                  ${option === value ? 'font-medium text-[#6D2E55] bg-purple-50/30' : 'text-gray-700'}`}
              >
                <span className="block truncate">{option}</span>
                
                {/* Checkmark for selected item */}
                {option === value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6D2E55]">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  // Default to "All Canada" if empty, similar to image
  const [province, setProvince] = useState(searchParams.get('province') || 'All Canada')
  const [employmentType, setEmploymentType] = useState(searchParams.get('type') || 'All Types')
  const [minSalary, setMinSalary] = useState(searchParams.get('salary') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (province && province !== 'All Canada') params.set('province', province)
    if (employmentType && employmentType !== 'All Types') params.set('type', employmentType)
    if (minSalary) params.set('salary', minSalary)
    
    router.push(`/jobs?${params.toString()}`)
  }

  const inputBaseClasses = "w-full rounded-lg border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-gray-700 placeholder-gray-500 focus:border-[#6D2E55] focus:outline-none focus:ring-1 focus:ring-[#6D2E55] transition-all"
  const iconBaseClasses = "absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"

  const provinces = [
    "All Canada", "Alberta", "British Columbia", "Manitoba", "New Brunswick", 
    "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", 
    "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"
  ]

  const types = [
    "All Types", "Full-time", "Part-time", "Contract", "Temporary"
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <form 
        onSubmit={handleSubmit} 
        // Changed: Removed shadow, added sole purple border
        className="relative rounded-xl border border-[#6D2E55] bg-white p-6"
      >
        <div className="flex flex-col gap-5">
          
          {/* Top Row: Search, Location, Type */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            
            {/* Job Title Search */}
            <div className="md:col-span-6">
              <div className="relative">
                <Search className={iconBaseClasses} />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={inputBaseClasses}
                />
              </div>
            </div>

            {/* Location Custom Dropdown */}
            <div className="md:col-span-3 z-20">
              <CustomSelect 
                icon={MapPin}
                value={province}
                onChange={setProvince}
                options={provinces}
                placeholder="Select Location"
              />
            </div>

            {/* Employment Type Custom Dropdown */}
            <div className="md:col-span-3 z-10">
              <CustomSelect 
                icon={Briefcase}
                value={employmentType}
                onChange={setEmploymentType}
                options={types}
                placeholder="Select Type"
              />
            </div>
          </div>

          {/* Bottom Row: Salary & Button */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            
            {/* Min Salary */}
            <div className="md:col-span-10">
              <div className="relative">
                <DollarSign className={iconBaseClasses} />
                <input
                  type="number"
                  placeholder="Min Salary"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className={inputBaseClasses}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="flex h-full w-full items-center justify-center gap-2 rounded-lg bg-[#6D2E55] px-6 py-3.5 font-semibold text-white transition-all hover:bg-[#562443] focus:outline-none focus:ring-2 focus:ring-[#6D2E55] focus:ring-offset-2"
              >
                <Search className="h-5 w-5" />
                <span>Search Jobs</span>
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}