import fs from 'fs';
import path from 'path';

const FORMS_FILE = path.join(process.cwd(), 'src/data/forms.json');
const SUBMISSIONS_FILE = path.join(process.cwd(), 'src/data/submissions.json');

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number' | 'date';
  required: boolean;
  options?: string[]; // Used for select type
}

export interface OpportunityForm {
  opportunityId: string;
  fields: FormField[];
}

export interface Submission {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  motivation: string;
  cvUrl?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  answers: Record<string, string | string[] | boolean>; // Stores responses for dynamic fields (key is Field ID)
}

// Helpers for Forms
export function readForms(): Record<string, FormField[]> {
  try {
    if (!fs.existsSync(FORMS_FILE)) {
      return {};
    }
    const data = fs.readFileSync(FORMS_FILE, 'utf-8');
    return JSON.parse(data || '{}');
  } catch (error) {
    console.error('Error reading forms.json:', error);
    return {};
  }
}

export function writeForms(forms: Record<string, FormField[]>): void {
  try {
    fs.writeFileSync(FORMS_FILE, JSON.stringify(forms, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing forms.json:', error);
  }
}

export function getOpportunityForm(opportunityId: string): FormField[] {
  const forms = readForms();
  return forms[opportunityId] || [];
}

export function saveOpportunityForm(opportunityId: string, fields: FormField[]): void {
  const forms = readForms();
  forms[opportunityId] = fields;
  writeForms(forms);
}

// Helpers for Submissions
export function readSubmissions(): Submission[] {
  try {
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading submissions.json:', error);
    return [];
  }
}

export function writeSubmissions(submissions: Submission[]): void {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing submissions.json:', error);
  }
}

export function getSubmissions(opportunityId?: string): Submission[] {
  const submissions = readSubmissions();
  if (opportunityId) {
    return submissions.filter(s => s.opportunityId === opportunityId);
  }
  return submissions;
}

export function addSubmission(submission: Omit<Submission, 'id' | 'createdAt' | 'status'>): Submission {
  const submissions = readSubmissions();
  const newSubmission: Submission = {
    ...submission,
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  
  submissions.push(newSubmission);
  writeSubmissions(submissions);
  return newSubmission;
}

export function updateSubmissionStatus(id: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED'): Submission | null {
  const submissions = readSubmissions();
  const index = submissions.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  submissions[index].status = status;
  writeSubmissions(submissions);
  return submissions[index];
}

export function deleteSubmission(id: string): boolean {
  const submissions = readSubmissions();
  const filtered = submissions.filter(s => s.id !== id);
  if (filtered.length === submissions.length) return false;
  
  writeSubmissions(filtered);
  return true;
}
