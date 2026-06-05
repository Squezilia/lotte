<script setup lang="ts">
import ChangeSignature from '../forms/ChangeSignature.vue';
import type { FormType } from '../forms/ChangeSignature.vue';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { toast } from 'vue-sonner';

const links = useLinks();

const open = defineModel('open', {
  type: Boolean,
  required: false,
});

const values = ref<FormType>({
  newPin: '',
  newPinAgain: '',
  pin: '',
});

async function onSubmit(values: FormType) {
  if (!values.newPin || !values.newPinAgain || !values.pin) return;

  await $fetch('/api/reconstruct-signature', {
    method: 'POST',
    body: {
      pin: values.pin,
      newPin: values.newPin,
    },
    onResponseError(ctx) {
      toast.error(ctx.response._data.message);
    },
  });

  toast.success('PIN Değiştirildi.');
  open.value = false;
  links.setPIN(values.newPin);
  links.links.refresh();
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger>
      <slot />
    </SheetTrigger>
    <SheetContent class="w-screen">
      <SheetHeader>
        <SheetTitle>PIN Değiştir</SheetTitle>
        <SheetDescription class="hidden">
          Arayüze PIN'inini değiştirin.
        </SheetDescription>
      </SheetHeader>

      <div class="px-4">
        <ChangeSignature v-model="values" @submit="onSubmit" />
      </div>
    </SheetContent>
  </Sheet>
</template>
