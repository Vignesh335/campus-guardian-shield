
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload } from "lucide-react";

interface Faculty {
  id: number;
  name: string;
  department: string;
}

interface VisitorFormPanelProps {
  facultyList: Faculty[];
  // onSubmit: (data: {
  //   name: string;
  //   purpose: string;
  //   faculty: number;
  //   photoUrl: string;
  // }) => void;
  onSubmit: (data) => void;
  newVisitor: any;
}

export default function VisitorFormPanel({ facultyList, onSubmit, newVisitor }: VisitorFormPanelProps) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [faculty, setFaculty] = useState<number | string>("");
  const [photoUrl, setPhotoUrl] = useState("/placeholder.svg");
  const [photo, setPhoto] = useState<any>();
  const [isCapturing, setIsCapturing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !purpose || !faculty) {
      return;
    }

    let formData = new FormData()

    formData.append("name", name);
    formData.append("purpose", purpose);
    formData.append("whom_to_meet", String(faculty));
    formData.append("photo", photo);

    try {
      const visitorResponse: any = await onSubmit(formData);

      if (visitorResponse) {
        // setName("")
        // setPhoto(null)
        // setPurpose("")
        // setFaculty("")
        console.log("Visitor created successfully:", visitorResponse);
      } else {
        console.error("Error creating visitor.");
      }
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
    }

    // onSubmit(formData)
  };

  const simulatePhotoCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setPhotoUrl("https://source.unsplash.com/random/400x400/?portrait");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visitor-name">Visitor Name</Label>
            <Input
              id="visitor-name"
              placeholder="Enter visitor's full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visit-purpose">Purpose of Visit</Label>
            <Textarea
              id="visit-purpose"
              placeholder="Briefly describe the purpose of this visit"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="min-h-24"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty-select">Whom to Meet</Label>
            <Select
              value={faculty.toString()}
              onValueChange={(value) => setFaculty(value)}
            >
              <SelectTrigger id="faculty-select">
                <SelectValue placeholder="Select faculty member" />
              </SelectTrigger>
              <SelectContent>
                {/* {facultyList.map((f) => ( */}
                {facultyList.map((f: any) => (
                  <SelectItem key={f.id} value={f.id.toString()}>
                    {/* {f.name} - {f.department} */}
                    {f.display_name} - {f.department_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-48 h-48 border-2 border-dashed border-border rounded-lg overflow-hidden flex items-center justify-center bg-muted">
            {isCapturing ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">Capturing...</p>
              </div>
            ) : (
              <>
                <img
                  src={photoUrl}
                  alt="Visitor"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {photoUrl === "/placeholder.svg" && (
                  <Camera className="h-12 w-12 text-muted-foreground" />
                )}
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={simulatePhotoCapture}
              disabled={isCapturing}
            >
              <Camera className="mr-2 h-4 w-4" />
              Capture Photo
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('photo-upload')?.click()}
              disabled={isCapturing}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // const url = URL.createObjectURL(file);
                  // setPhotoUrl(url);
                  setPhoto(file);
                }
                else {
                  setPhoto(null)
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          // disabled={!name || !purpose || !faculty || photoUrl === "/placeholder.svg"}
          disabled={!name || !purpose || !faculty || !photo || Object.keys(newVisitor).length > 0}
        >
          Submit Visitor Information
        </Button>
      </div>
    </form>
  );
}
