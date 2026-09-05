import { FormSubmissionStatus } from './enums';

export type FormFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date';

export interface FormField {
  id: string;
  formId: string;
  fieldName: string;
  label: string;
  fieldType: FormFieldType;
  placeholder?: string;
  defaultValue?: string;
  isRequired: boolean;
  options?: Array<{ label: string; value: string }>;
  sortOrder: number;
}

export interface FormDefinition {
  id: string;
  title: string;
  code: string;
  description?: string;
  submitButtonText: string;
  successMessage: string;
  branchId?: string | null;
  isActive: boolean;
  fields: FormField[];
}

export interface FormSubmission {
  id: string;
  formId: string;
  branchId?: string | null;
  status: FormSubmissionStatus;
  values: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
