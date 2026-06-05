<script setup lang="ts">
import { toast } from 'vue-sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Loader2 } from 'lucide-vue-next';

const open = defineModel('open', {
  type: Boolean,
  required: true,
});

const props = defineProps<{
  linkId: string;
}>();

const links = useLinks();
const isLoading = ref(false);

async function deleteLink() {
  isLoading.value = true;
  await $fetch('/api/link', {
    method: 'DELETE',
    body: {
      id: props.linkId,
      pin: links.pin.value,
    },
    onResponseError(ctx) {
      toast.error(ctx.response._data.message);
    },
  });

  toast.success('Bağlantı Silindi.');
  isLoading.value = false;
  open.value = false;
  links.links.refresh();
}
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Gerçekten emin misiniz?</AlertDialogTitle>
        <AlertDialogDescription>
          Bu bağlantıyı silmek istediniğinize emin misiniz? Bağlantı arayüzden
          geri döndürülemez şekilde silinecektir.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isLoading" @click="open = false"
          >Cancel</AlertDialogCancel
        >
        <AlertDialogAction :disabled="isLoading" @click="deleteLink"
          ><Loader2 v-if="isLoading" class="animate-spin" />
          Continue</AlertDialogAction
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
