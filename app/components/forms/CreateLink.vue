<script setup lang="ts">
import { Field as VeeField } from 'vee-validate';
import { Loader2, Plus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from '~/components/ui/field';
import * as z from 'zod';
import FormBase from './FormBase.vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const formSchema = z.object({
  type: z.enum(['URL', 'PHONE']),
  title: z
    .string()
    .min(2, 'Bağlantı adı 2 karakterden kısa olamaz.')
    .max(64, 'Bağlantı adı 64 karakterden uzun olamaz.')
    .nonempty('Bağlantı ismi gerekmektedir.'),
  description: z
    .string()
    .min(2, 'Bağlantı açıklaması 2 karakterden kısa olamaz.')
    .max(64, 'Bağlantı açıklaması 64 karakterden uzun olamaz.')
    .nonempty('Bağlantı açıklaması gerekmektedir.'),
  uri: z
    .string()
    .min(2, 'Bağlantı 2 karakterden kısa olamaz.')
    .max(64, 'Bağlantı 64 karakterden uzun olamaz.')
    .nonempty('Bağlantı gerekmektedir.'),
});

export type FormType = Partial<typeof formSchema._type>;

const props = defineProps<{
  modelValue: FormType;
  isSubmitting?: boolean;
}>();

defineEmits<{
  submit: [FormType];
  'update:modelValue': [FormType | undefined];
  'update:isSubmitting': [boolean];
}>();
</script>

<template>
  <FormBase
    :model-value="modelValue"
    :is-submitting="isSubmitting"
    class="space-y-6"
    :form-schema="formSchema"
    @update:model-value="$emit('update:modelValue', $event)"
    @update:is-submitting="$emit('update:isSubmitting', $event)"
    @submit="(values) => $emit('submit', values)"
  >
    <FieldGroup>
      <VeeField v-slot="{ field, errors }" name="type">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="language"> Bağlantı Türü </FieldLabel>
          <Select
            :model-value="field.value"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          >
            <SelectTrigger
              id="language"
              class="min-w-30"
              :aria-invalid="!!errors.length"
            >
              <SelectValue placeholder="Bağlantı Türü..." />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectItem value="URL"> Link </SelectItem>
              <SelectItem value="PHONE"> Telefon </SelectItem>
            </SelectContent>
          </Select>
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>
      <VeeField v-slot="{ field, errors }" name="title">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="name"> Bağlantı Adı </FieldLabel>
          <Input
            v-bind="field"
            id="name"
            tabindex="1"
            type="text"
            placeholder="Instagram"
            :aria-invalid="!!errors.length"
            required
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>
      <VeeField v-slot="{ field, errors }" name="description">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="name"> Bağlantı Açıklaması </FieldLabel>
          <Input
            v-bind="field"
            id="name"
            tabindex="1"
            type="text"
            placeholder="Ana Hesabım"
            :aria-invalid="!!errors.length"
            required
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>
      <VeeField v-slot="{ field, errors }" name="uri">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="name">
            {{ props.modelValue.type === 'URL' ? 'Bağlantı' : 'Telefon' }}
          </FieldLabel>
          <Input
            v-bind="field"
            id="name"
            tabindex="1"
            type="text"
            :placeholder="
              props.modelValue.type === 'URL'
                ? 'https://instagram.com/'
                : '+905123456789'
            "
            :maxlength="props.modelValue.type === 'PHONE' ? 13 : undefined"
            :inputmode="props.modelValue.type === 'PHONE' ? 'tel' : undefined"
            :aria-invalid="!!errors.length"
            required
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>
    </FieldGroup>

    <div class="flex justify-end gap-2">
      <Button class="gap-2" type="submit" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="size-4 animate-spin" />
        <span>
          {{ isSubmitting ? 'Oluşturuluyor...' : 'Bağlantıyı Oluştur' }}
        </span>
        <Plus v-if="!isSubmitting" />
      </Button>
    </div>
  </FormBase>
</template>
