import { FormDefinition } from '@school-cms/shared';
import { z } from 'zod';

/**
 * Tự động tạo Zod Schema từ danh sách FormField để validate dữ liệu submit
 */
export function buildZodSchemaFromFormDefinition(formDef: FormDefinition) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of formDef.fields) {
    let validator: z.ZodTypeAny = z.any();

    switch (field.fieldType) {
      case 'email':
        validator = z.string().email('Email không đúng định dạng');
        break;
      case 'number':
        validator = z.coerce.number();
        break;
      case 'phone':
        validator = z.string().regex(/^[0-9+ ]{9,15}$/, 'Số điện thoại không hợp lệ');
        break;
      case 'text':
      case 'textarea':
      default:
        validator = z.string();
        break;
    }

    if (field.isRequired) {
      if (validator instanceof z.ZodString) {
        validator = (validator as z.ZodString).min(1, `${field.label} không được để trống`);
      }
    } else {
      validator = validator.optional();
    }

    shape[field.fieldName] = validator;
  }

  return z.object(shape);
}
