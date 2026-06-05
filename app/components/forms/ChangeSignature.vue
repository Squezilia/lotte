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

const formSchema = z
  .object({
    pin: z
      .string()
      .min(6, 'PIN 6 karakterden kısa olamaz.')
      .max(6, 'PIN 6 karakterden uzun olamaz.')
      .nonempty('PIN gerekmektedir.'),
    newPin: z
      .string()
      .min(6, 'PIN 6 karakterden kısa olamaz.')
      .max(6, 'PIN 6 karakterden uzun olamaz.')
      .nonempty('PIN gerekmektedir.'),
    newPinAgain: z
      .string()
      .min(6, 'PIN 6 karakterden kısa olamaz.')
      .max(6, 'PIN 6 karakterden uzun olamaz.')
      .nonempty('PIN gerekmektedir.'),
  })
  .superRefine(({ newPin, newPinAgain }, ctx) => {
    if (newPin && newPinAgain && newPin !== newPinAgain) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['newPinAgain'],
        message: 'PINler eşleşmiyor.',
      });
    }
  });

export type FormType = Partial<typeof formSchema._type>;

defineProps<{
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
      <VeeField v-slot="{ field, errors }" name="pin">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="name"> Eski PIN </FieldLabel>
          <Input
            v-bind="field"
            id="name"
            tabindex="1"
            type="text"
            placeholder="• • • • • •"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            :aria-invalid="!!errors.length"
            required
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>
      <VeeField v-slot="{ field, errors }" name="newPin">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="name"> Yeni PIN </FieldLabel>
          <Input
            v-bind="field"
            id="name"
            tabindex="1"
            type="text"
            placeholder="• • • • • •"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            :aria-invalid="!!errors.length"
            required
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>
      <VeeField v-slot="{ field, errors }" name="newPinAgain">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="name"> Yeni PIN (Tekrar) </FieldLabel>
          <Input
            v-bind="field"
            id="name"
            tabindex="1"
            type="text"
            placeholder="• • • • • •"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
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
          {{ isSubmitting ? 'Güncelleniyor...' : "PIN'i Değiştir" }}
        </span>
        <Plus v-if="!isSubmitting" />
      </Button>
    </div>
  </FormBase>
</template>
