<script setup lang="ts">
import type { FormType } from '../forms/CreateLink.vue';
import CreateLink from '../forms/CreateLink.vue';
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
  type: 'URL',
  title: '',
  description: '',
  uri: '',
});

async function onSubmit(values: FormType) {
  if (!values.uri || !values.description || !values.title) return;

  await $fetch('/api/link', {
    method: 'POST',
    body: {
      type: values.type,
      title: values.title,
      description: values.description,
      uri: values.uri,
      pin: links.pin.value,
    },
    onResponseError(ctx) {
      toast.error(ctx.response._data.message);
    },
  });

  toast.success('Bağlantı Oluşturuldu.');
  open.value = false;
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
        <SheetTitle>Yeni Link</SheetTitle>
        <SheetDescription class="hidden">
          Arayüze yeni bir bağlantı ekleyin.
        </SheetDescription>
      </SheetHeader>

      <div class="px-4">
        <CreateLink v-model="values" @submit="onSubmit" />
      </div>
    </SheetContent>
  </Sheet>
</template>
