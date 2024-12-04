import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <Card className="mt-12">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-primary">About Us</h2>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          Welcome to Petopia, where furry friends find their forever homes!
          We&apos;re passionate about connecting loving families with adorable
          pets in need. Our mission is to create joyful bonds between humans and
          animals, one adoption at a time. With a wide variety of cats, dogs,
          and other cuddly creatures, we&apos;re sure you&apos;ll find your
          perfect companion here at Petopia.
        </p>
      </CardContent>
    </Card>
  );
}
