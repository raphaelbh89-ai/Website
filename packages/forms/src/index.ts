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
      case 'tel':
        validator = z.string().regex(/^[0-9+ \-.()]{8,20}$/, 'Số điện thoại không hợp lệ');
        break;
      case 'select':
      case 'radio':
        if (field.options && field.options.length > 0) {
          const allowedValues = field.options.map((opt: any) => (typeof opt === 'string' ? opt : opt.value));
          validator = z.string().refine((val) => allowedValues.includes(val), {
            message: `Giá trị phải nằm trong danh mục: ${allowedValues.join(', ')}`,
          });
        } else {
          validator = z.string();
        }
        break;
      case 'checkbox':
        validator = z.boolean();
        break;
      case 'date':
        validator = z.string().regex(/^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/, 'Ngày không đúng định dạng');
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

/**
 * Làm sạch dữ liệu form (trim khoảng trắng, loại bỏ tag HTML độc hại)
 */
export function sanitizeFormSubmission(data: Record<string, any>): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === 'string') {
      clean[k] = v.trim().replace(/<[^>]*>?/gm, '');
    } else {
      clean[k] = v;
    }
  }
  return clean;
}
