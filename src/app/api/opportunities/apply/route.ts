import { NextResponse } from 'next/server';
import { addSubmission } from '@/lib/storage';
import { z } from 'zod';

const applySchema = z.object({
  opportunityId: z.string().min(1, 'Opportunity ID is required'),
  opportunityTitle: z.string().min(1, 'Opportunity title is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(4, 'Invalid phone number'),
  birthDate: z.string().min(1, 'Birth date is required'),
  motivation: z.string().min(10, 'Motivation must be at least 10 characters long'),
  cvUrl: z.string().url('Invalid URL format').or(z.literal('')).optional(),
  answers: z.record(z.string(), z.any()).default({}),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const result = applySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const submissionData = result.data;

    // Save submission using local storage manager
    const saved = addSubmission({
      opportunityId: submissionData.opportunityId,
      opportunityTitle: submissionData.opportunityTitle,
      firstName: submissionData.firstName,
      lastName: submissionData.lastName,
      email: submissionData.email,
      phone: submissionData.phone,
      birthDate: submissionData.birthDate,
      motivation: submissionData.motivation,
      cvUrl: submissionData.cvUrl || undefined,
      answers: submissionData.answers,
    });

    return NextResponse.json({ success: true, submission: saved });
  } catch (error) {
    console.error('Error in apply API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
