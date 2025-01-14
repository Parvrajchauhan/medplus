"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, MessageSquareMore, Phone, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DNA } from "react-loader-spinner";

const DoctorInfo = ({ params: { _id } }: {params: {_id:string}}) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/search?id=${_id}`);
        const data = await response.json();
        console.log("Doctor Data:", data);
        setDoctor(data);
      } catch (error) {
        console.error("Failed to fetch doctor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [_id]);

  const handleChatNow = () => {
    window.location.href = '/chat';
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex-center">
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{ filter: "hue-rotate(180deg)" }}
          wrapperClass="dna-wrapper"
        />
      </div>
    );
  }

  if (!doctor) {
    return <p className="mx-auto flex-center">Doctor not found</p>;
  }

  return (
    <div className="container mx-auto px-4 py-20 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={doctor.user.photo} alt={doctor.user.username} />
              <AvatarFallback>{doctor.user.firstName + " " + doctor.user.lastName}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle>{doctor.user.firstName + " " + doctor.user.lastName}</CardTitle>
                <Badge>{doctor.availability[0]?.day}</Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                {doctor.rating} Rating
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{doctor.specializations.join(', ')}</Badge>
                <span className="text-sm text-muted-foreground">
                  {doctor.experience}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="font-semibold mb-2">Organizations</h3>
              <p className="text-sm text-muted-foreground">{doctor.professionalDetails.professionalOrganizations}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Languages spoken</h3>
              <p className="text-sm text-muted-foreground">{doctor.languages}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Education</h3>
              <ul className="grid gap-2">
                {doctor.education.map((edu, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {edu}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.specializations.map((spec, index) => (
                  <Badge key={index} variant="outline">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Schedule Appointment</CardTitle>
            <CardDescription>Available time slots for today</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <Clock className="h-4 w-4" />
                Next Available: Today
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                {doctor.phone}
              </div>
            </div>
            <div className="grid gap-2">
              <Button size="lg" onClick={handleChatNow}>
              <MessageSquareMore className="mr-2 h-4 w-4" />
                Chat Now
              </Button>
              <Button size="lg" variant="outline" onClick={()=>router.push('/patient/features/health-calendar')}>
                Schedule for Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Link href="/patient/features/health-connect">
          <Button variant="outline">Back to Doctors List</Button>
        </Link>
      </div>
    </div>
  );
};
export default DoctorInfo;
