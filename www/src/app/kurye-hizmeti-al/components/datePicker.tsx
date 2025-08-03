import React, { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerWithPresetsProps {
  setReturnedDate: (date: Date | undefined) => void;
}

export function DatePickerWithPresets({ setReturnedDate }: DatePickerWithPresetsProps) {
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    setReturnedDate(date);
  }, [date]);

  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date ? new Intl.DateTimeFormat("tr-TR", options).format(date) : "Tarih seçin";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[220px] h-[48px] justify-start text-left font-normal rounded-full",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formattedDate : <span>Tarih Seçiniz</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) =>
            setDate(addDays(new Date(), parseInt(value)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seç" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Bugün</SelectItem>
            <SelectItem value="1">Yarın</SelectItem>
            <SelectItem value="3">3 gün içinde</SelectItem>
            <SelectItem value="7">Bir hafta sonra</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
