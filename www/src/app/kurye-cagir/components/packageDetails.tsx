import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PackageDetails as PackageDetailsType } from "@/types";

interface PackageDetailsProps {
  packageDetails: PackageDetailsType;
  setPackageDetails: React.Dispatch<React.SetStateAction<PackageDetailsType>>;
}

export function PackageDetails({ packageDetails, setPackageDetails }: PackageDetailsProps): JSX.Element {
  const handlePackageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log({ name, value });
    setPackageDetails((detail) => {
      return { ...detail, [name]: value };
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Paket Detayı Giriniz</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Paket Detayları</h4>
            <p className="text-sm text-muted-foreground">
              Kutu detaylarını girin.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">
                Genişlik
              </Label>
              <Input
                id="width"
                name="width"
                type="number"
                className="col-span-2 h-8"
                defaultValue={packageDetails.width}
                onChange={handlePackageChange}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="length">
                Uzunluk
              </Label>
              <Input
                id="length"
                name="length"
                type="number"
                className="col-span-2 h-8"
                defaultValue={packageDetails.length}
                onChange={handlePackageChange}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">
                Derinlik
              </Label>
              <Input
                id="height"
                name="height"
                type="number"
                className="col-span-2 h-8"
                defaultValue={packageDetails.height}
                onChange={handlePackageChange}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="weight">
                Ağırlık
              </Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                className="col-span-2 h-8"
                defaultValue={packageDetails.weight}
                onChange={handlePackageChange}
              />
              {/* <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seç" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Kilogram</SelectLabel>
                    <SelectItem value="apple">2 kg'a kadar</SelectItem>
                    <SelectItem value="banana">5 kg'a kadar</SelectItem>
                    <SelectItem value="blueberry">10 kg'a kadar</SelectItem>
                    <SelectItem value="grapes">15 kg'a kadar</SelectItem>
                    <SelectItem value="pineapple">20 kg'a kadar</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select> */}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
