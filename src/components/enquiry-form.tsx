
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  adults: z.string().min(1, "Please select the number of adults."),
  children: z.string().min(1, "Please select the number of children."),
  ship: z.string().min(3, "Please enter a valid ship name."),
  departureDates: z.string().min(1, "Please enter your desired departure dates."),
  destination: z.string().min(3, "Please enter your desired destination."),
  vendorId: z.string().optional(),
  cabinType: z.string().min(1, "Please select a cabin type."),
  experience: z.string().min(1, "Please select an experience."),
  drinksPackage: z.enum(["yes", "no"], { required_error: "Please select an option for drinks package." }),
  sailedWithMsc: z.enum(["yes", "no"], { required_error: "Please select if you have sailed with MSC before." }),
  hasVoyagersNumber: z.enum(["yes", "no", "not_sure"]).optional(),
  voyagersNumber: z.string().optional(),
  voyagersInfo: z.string().optional(),
}).refine(data => {
    if (data.sailedWithMsc === 'yes' && data.hasVoyagersNumber === 'yes') {
        return !!data.voyagersNumber && data.voyagersNumber.length > 0;
    }
    return true;
}, {
    message: "Please enter your Voyagers Club number.",
    path: ["voyagersNumber"],
}).refine(data => {
    if (data.sailedWithMsc === 'yes' && data.hasVoyagersNumber === 'not_sure') {
        return !!data.voyagersInfo && data.voyagersInfo.length > 0;
    }
    return true;
}, {
    message: "Please provide your full name and date of birth.",
    path: ["voyagersInfo"],
});

export type EnquiryFormValues = z.infer<typeof formSchema>;

interface EnquiryFormProps {
  onSubmit: (data: EnquiryFormValues) => Promise<void>;
  isLoading: boolean;
  serverError: string | null;
  initialData?: Partial<EnquiryFormValues>;
}

export function EnquiryForm({ onSubmit, isLoading, serverError, initialData }: EnquiryFormProps) {
  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      adults: "2",
      children: "0",
      cabinType: "Don't Know",
      experience: "Don't Know",
      ...initialData,
    },
  });

  const sailedWithMsc = form.watch("sailedWithMsc");
  const hasVoyagersNumber = form.watch("hasVoyagersNumber");

  return (
    <Card className="w-full border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Request a Quote</CardTitle>
        <CardDescription>Fill out the form below and we'll get back to you with a personalized cruise quote.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Adults</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of adults" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(11).keys()].slice(1).map(i => (
                          <SelectItem key={i} value={String(i)}>{i}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="children"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Children</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of children" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(11).keys()].map(i => (
                          <SelectItem key={i} value={String(i)}>{i}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ship"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Cruise Ship</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., MSC Virtuosa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Caribbean, Norwegian Fjords" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departureDates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Dates</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Summer 2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cabinType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cabin Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cabin type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Don't Know">Don't Know</SelectItem>
                        <SelectItem value="Interior">Interior</SelectItem>
                        <SelectItem value="Ocean View">Ocean View</SelectItem>
                        <SelectItem value="Balcony">Balcony</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Don't Know">Don't Know</SelectItem>
                        <SelectItem value="Bella">Bella</SelectItem>
                        <SelectItem value="Fantastica">Fantastica</SelectItem>
                        <SelectItem value="Aurea">Aurea</SelectItem>
                        <SelectItem value="Yacht Club">Yacht Club</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="drinksPackage"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Do you want a drinks package?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sailedWithMsc"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Have you sailed with MSC before?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {sailedWithMsc === 'yes' && (
                 <div className="md:col-span-2 space-y-6 animate-in fade-in-0 duration-300">
                    <FormField
                      control={form.control}
                      name="hasVoyagersNumber"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Do you have a Voyagers Club number?</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="yes" /></FormControl>
                                <FormLabel className="font-normal">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="no" /></FormControl>
                                <FormLabel className="font-normal">No</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="not_sure" /></FormControl>
                                <FormLabel className="font-normal">Not Sure</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {hasVoyagersNumber === 'yes' && (
                        <FormField
                            control={form.control}
                            name="voyagersNumber"
                            render={({ field }) => (
                            <FormItem className="animate-in fade-in-0 duration-300">
                                <FormLabel>Voyagers Club Number</FormLabel>
                                <FormControl>
                                <Input placeholder="Enter your number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    )}

                    {hasVoyagersNumber === 'not_sure' && (
                        <FormField
                            control={form.control}
                            name="voyagersInfo"
                            render={({ field }) => (
                            <FormItem className="animate-in fade-in-0 duration-300">
                                <FormLabel>Full Name and Date of Birth</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Please provide your full name and DOB (dd/mm/yyyy) so we can check for you." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    )}

                 </div>
              )}


            </div>
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Submission Failed</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground text-base font-bold hover:bg-accent/90" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Submitting..." : "Get My Quote"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
