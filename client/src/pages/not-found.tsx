import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { Droplets } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="text-center">
          <Droplets className="h-16 w-16 text-primary/30 mx-auto mb-6" />
          <h1 className="font-display font-bold text-4xl tracking-tight mb-3">404</h1>
          <p className="text-muted-foreground mb-6">This page doesn't exist. Maybe it evaporated.</p>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
