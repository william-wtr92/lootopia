"use client"

import { format, getMonth, getYear, setMonth, setYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"

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
  value?: Date | string | undefined
  onChange?: (date: string) => void
  months?: string[]
  placeholder?: string
  blockFutureDates?: boolean
  minDate?: Date
}

export const DatePicker = ({
  startYear = getYear(new Date()) - 100,
  endYear = new Date().getFullYear(),
  className,
  value,
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
  blockFutureDates = false,
  minDate,
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
    if (selectedDate) {
      const formattedDate = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`

      setDate(selectedDate)

      if (onChange) {
        onChange(formattedDate)
      }
    } else {
      setDate(undefined)

      if (onChange) {
        onChange("")
      }
    }

    setIsPopoverOpen(false)
  }

  const handleDisabledDates = (date: Date): boolean => {
    return (
      (blockFutureDates && date > new Date()) ||
      (minDate ? date < minDate : false)
    )
  }

  useEffect(() => {
    setDate(value ? new Date(value) : undefined)
  }, [value])

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
          disabled={handleDisabledDates}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
