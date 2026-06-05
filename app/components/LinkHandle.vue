<script setup lang="ts">
import { Edit2, Trash } from 'lucide-vue-next';
import { motion, useMotionValue, useTransform, type PanInfo } from 'motion-v';
import type { LinkType } from '~~/generated/prisma/enums';

const props = defineProps<{
  type: LinkType;
  title: string;
  description: string;
  image: string;
  uri: string;
}>();

const emit = defineEmits<{
  edit: [];
  delete: [];
}>();

const links = useLinks();

const x = useMotionValue(0);
const eventOpacity = useTransform(x, [-75, 0, 75], [1, 0, 1]);
const event = ref<'idle' | 'delete' | 'edit'>('idle');
const triggerPINProgress = ref(0);

function onDrag(ev: PointerEvent, info: PanInfo) {
  triggerPINProgress.value = info.offset.x / 175;

  // edit
  if (triggerPINProgress.value > 0) {
    event.value = 'edit';
  }
  // delete
  if (triggerPINProgress.value < 0) {
    event.value = 'delete';
  }
}

function onDragEnd() {
  setTimeout(() => {
    // edit
    if (triggerPINProgress.value > 1) {
      emit('edit');
    }
    // delete
    if (triggerPINProgress.value < -1) {
      emit('delete');
    }
  }, 200);
}

function onDragTransitionEnd() {
  triggerPINProgress.value = 0;
}
</script>

<template>
  <div class="w-full relative">
    <motion.div
      :data-event="event"
      :style="{
        opacity: eventOpacity,
      }"
      class="absolute rounded-xl top-0 left-0 w-full h-full z-5 data-[event=delete]:bg-destructive flex items-center px-8 justify-between data-[event=edit]:bg-amber-600"
    >
      <Edit2 />
      <Trash />
    </motion.div>
    <motion.a
      :href="props.type === 'URL' ? props.uri : `tel:${props.uri}`"
      :drag="links.state.value ? 'x' : false"
      drag-direction-lock
      :drag-constraints="{ top: 0, right: 0, bottom: 0, left: 0 }"
      :drag-transition="{ bounceStiffness: 200, bounceDamping: 30 }"
      :drag-elastic="0.4"
      :while-drag="{ cursor: 'grabbing' }"
      :transition="{
        ease: [0.33, 1, 0.68, 1],
      }"
      :while-press="{
        scale: 0.95,
      }"
      :style="{ x }"
      class="border relative rounded-xl z-6 bg-background w-full flex items-center h-20 p-2.5 gap-2.5"
      @drag="onDrag"
      @drag-end="onDragEnd"
      @drag-transition-end="onDragTransitionEnd"
    >
      <NuxtImg
        class="aspect-square h-full w-auto rounded-xl"
        :src="image"
        :alt="title"
        :placeholder="[50, 25, 75, 5]"
      />
      <div class="flex flex-col">
        <span class="font-semibold">{{ title }}</span>
        <p>{{ description }}</p>
      </div>
    </motion.a>
  </div>
</template>
