/* eslint-disable complexity */
"use client"

import { format, getMonth, getYear, setMonth, setYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { cn } from "@ui/lib/utils"

type DatePickerProps = {
  startYear?: number
  endYear?: number
  className?: string
  onChange?: (date: Date | undefined) => void
  months?: string[]
  placeholder?: string
}

export const DatePicker = ({
  startYear = getYear(new Date()) - 100,
  endYear = new Date().getFullYear(),
  className,
  onChange,
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  placeholder = "Pick a date",
}: DatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  )

  const handleMonthChange = (month: string) => {
    const newDate = date ? setMonth(date, months.indexOf(month)) : new Date()
    setDate(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = date ? setYear(date, parseInt(year)) : new Date()
    setDate(newDate)
  }

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)

    if (onChange) {
      onChange(selectedDate)
    }

    // Fermez la popover après avoir sélectionné une date
    setIsPopoverOpen(false)
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[250px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "dd-MM-yyyy")
          ) : (
            <span>{placeholder || "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className={cn("w-auto p-0", className)}>
        <div className="flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={date ? months[getMonth(date)] : undefined}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className={cn(className)}>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={handleYearChange}
            value={date ? getYear(date).toString() : undefined}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className={cn(className)}>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          month={date}
          onMonthChange={(newDate) => setDate(newDate)}
          className={cn("text-white", "day-selected:text-white", className)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
