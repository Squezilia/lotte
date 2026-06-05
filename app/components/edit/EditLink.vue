<script setup lang="ts">
import { toast } from 'vue-sonner';
import type { FormType } from '../forms/EditLink.vue';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import EditLink from '../forms/EditLink.vue';
import type { LinkType } from '~~/generated/prisma/enums';

const props = defineProps<{
  linkId: string;
}>();

const open = defineModel('open', {
  type: Boolean,
  required: true,
});

const type = ref<LinkType>('URL');

const values = ref<FormType>({
  title: '',
  description: '',
  uri: '',
});

const links = useLinks();

watch(
  open,
  async (newVal) => {
    if (!newVal) return;
    const linkData = await $fetch('/api/link', {
      query: {
        id: props.linkId,
      },
      cache: 'no-cache',
    });

    if (!linkData[0]) return (open.value = false);
    type.value = linkData[0].type;
    values.value = {
      description: linkData[0].description,
      title: linkData[0].title,
      uri: linkData[0].uri,
    };
  },
  {}
);

async function onSubmit(values: FormType) {
  if (!values.uri || !values.description || !values.title) return;

  await $fetch('/api/link', {
    method: 'PUT',
    body: {
      id: props.linkId,
      title: values.title,
      description: values.description,
      uri: values.uri,
      pin: links.pin.value,
    },
    onResponseError(ctx) {
      toast.error(ctx.response._data.message);
    },
  });

  toast.success('Bağlantı Düzenlendi.');
  open.value = false;
  links.links.refresh();
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent class="w-screen">
      <SheetHeader>
        <SheetTitle>Link Düzenle</SheetTitle>
        <SheetDescription class="hidden">
          Arayüzdeki bir bağlantıyı güncelleyin.
        </SheetDescription>
      </SheetHeader>

      <div class="px-4">
        <EditLink v-model="values" :type="type" @submit="onSubmit" />
      </div>
    </SheetContent>
  </Sheet>
</template>
