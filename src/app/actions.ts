
'use server';

import { z } from 'zod';
import { suggestAlternativeCruises, SuggestAlternativeCruisesInput } from '@/ai/flows/suggest-alternative-cruises';
import nodemailer from 'nodemailer';

const EnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  ship: z.string().min(3, 'Please enter a valid ship name.'),
  departureDates: z.string().min(1, 'Please enter your desired departure dates.'),
  destination: z.string().min(3, 'Please enter your desired destination.'),
  adults: z.string().min(1, "Please select the number of adults."),
  children: z.string().min(1, "Please select the number of children."),
  vendorId: z.string().optional(),
  cabinType: z.string().min(1, "Please select a cabin type."),
  experience: z.string().min(1, "Please select an experience."),
  drinksPackage: z.enum(["yes", "no"]),
  sailedWithMsc: z.enum(["yes", "no"]),
  hasVoyagersNumber: z.enum(["yes", "no", "not_sure"]).optional(),
  voyagersNumber: z.string().optional(),
  voyagersInfo: z.string().optional(),
});

async function sendEnquiryEmail(data: z.infer<typeof EnquirySchema>) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.ENQUIRY_RECIPIENT_EMAIL) {
    console.warn("SMTP environment variables not set. Skipping email dispatch. Please configure them in your .env file.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: (process.env.SMTP_PORT || "587") === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Get That Cruise Enquiry" <${process.env.SMTP_USER}>`,
    to: process.env.ENQUIRY_RECIPIENT_EMAIL, // Can be a comma-separated list
    subject: `New Cruise Enquiry from ${data.name}`,
    html: `
      <h1>New Cruise Enquiry</h1>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <hr>
      <h2>Cruise Details</h2>
      <p><strong>Ship:</strong> ${data.ship}</p>
      <p><strong>Desired Dates:</strong> ${data.departureDates}</p>
      <p><strong>Destination:</strong> ${data.destination}</p>
      ${data.vendorId ? `<p><strong>Vendor ID:</strong> ${data.vendorId}</p>` : ''}
      <hr>
      <h2>Passenger & Preference Details</h2>
      <p><strong>Adults:</strong> ${data.adults}</p>
      <p><strong>Children:</strong> ${data.children}</p>
      <p><strong>Cabin Type:</strong> ${data.cabinType}</p>
      <p><strong>Experience:</strong> ${data.experience}</p>
      <p><strong>Drinks Package:</strong> ${data.drinksPackage === 'yes' ? 'Yes' : 'No'}</p>
      <hr>
      <h2>MSC Voyagers Club</h2>
      <p><strong>Sailed with MSC before:</strong> ${data.sailedWithMsc === 'yes' ? 'Yes' : 'No'}</p>
      ${data.sailedWithMsc === 'yes' ? `
        <p><strong>Has Voyagers Club number:</strong> ${data.hasVoyagersNumber || 'Not specified'}</p>
        ${data.hasVoyagersNumber === 'yes' && data.voyagersNumber ? `<p><strong>Voyagers Club Number:</strong> ${data.voyagersNumber}</p>` : ''}
        ${data.hasVoyagersNumber === 'not_sure' && data.voyagersInfo ? `<p><strong>Client Info for lookup:</strong> ${data.voyagersInfo}</p>` : ''}
      ` : ''}
    `,
  };

  await transporter.sendMail(mailOptions);
}


export async function submitEnquiry(formData: unknown): Promise<{ success: boolean; suggestions?: string[]; error?: string }> {
  const parsed = EnquirySchema.safeParse(formData);

  if (!parsed.success) {
    console.error('Form validation failed:', parsed.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid form data. Please check your entries and try again.' };
  }
    
  try {
    // Send the enquiry details via email
    await sendEnquiryEmail(parsed.data);

    // After sending the email, proceed to the AI suggestion step.
    const aiSuggestions = await suggestAlternativeCruises(parsed.data as SuggestAlternativeCruisesInput);

    return { success: true, suggestions: aiSuggestions.suggestions };
  } catch (error) {
    console.error('Enquiry submission failed:', error);
    // Differentiate between email failure and AI failure if needed
    if (error instanceof Error && error.message.includes('SMTP')) {
       return { success: false, error: 'There was an issue sending your enquiry. Please try again later.' };
    }
    return { success: false, error: 'We could not process your enquiry at this time. Please try again later.' };
  }
}
