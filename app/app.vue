<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import {
  motion,
  type PanInfo,
  AnimatePresence,
  useMotionValue,
} from 'motion-v';
import DeleteLink from './components/edit/DeleteLink.vue';
import PIN from '@/components/pin/index.vue';
import PINUI from '@/components/pin/UI.vue';
import Sonner from './components/ui/sonner/Sonner.vue';
import { parse } from 'url';

import 'vue-sonner/style.css';

useColorMode().value = 'auto';

const links = useLinks();

const selectedLinkID = ref<string>('');
const editLink = ref(false);
const deleteLink = ref(false);

const y = useMotionValue(0);
const triggerPINProgress = ref(0);
const overlayPIN = ref(false);

function onDrag(event: PointerEvent, info: PanInfo) {
  triggerPINProgress.value = info.offset.y / 450;
}

function onDragEnd() {
  if (triggerPINProgress.value >= 1) overlayPIN.value = true;
}

function onDragTransitionEnd() {
  triggerPINProgress.value = 0;
}
</script>

<template>
  <Sonner position="top-center" />
  <AnimatePresence mode="wait">
    <motion.div
      layout
      :transition="{ duration: 0.3 }"
      class="bg-background transition-color"
    >
      <PIN :y="y" />
      <PINUI v-if="overlayPIN" @close-modal="overlayPIN = false" />
      <EditHeader v-if="links.state.value" />

      <EditLink v-model:open="editLink" :link-id="selectedLinkID" />
      <DeleteLink v-model:open="deleteLink" :link-id="selectedLinkID" />

      <motion.main
        class="w-full rounded-t-xl h-screen z-5 relative bg-background flex flex-col items-center p-2.5 gap-2"
        layout
        :drag="links.state.value ? false : 'y'"
        drag-direction-lock
        :drag-constraints="{ top: 0, right: 0, bottom: 0, left: 0 }"
        :drag-transition="{ bounceStiffness: 200, bounceDamping: 30 }"
        :drag-elastic="0.2"
        :while-drag="{ cursor: 'grabbing' }"
        :transition="{
          ease: [0.33, 1, 0.68, 1],
        }"
        :style="{
          y,
        }"
        @drag="onDrag"
        @drag-end="onDragEnd"
        @drag-transition-end="onDragTransitionEnd"
      >
        <ClientOnly>
          <template v-if="links.links.pending.value">
            <LinkSkeleton v-for="n in 6" :key="n" />
          </template>
          <LinkHandle
            v-for="item of links.links.data.value"
            v-else
            :key="item.id"
            :type="item.type"
            :title="item.title"
            :description="item.description"
            :image="
              item.type === 'URL'
                ? `https://www.google.com/s2/favicons?sz=64&domain=${parse(item.uri).host}`
                : '/phone.jpg'
            "
            :uri="item.uri"
            @edit="
              () => {
                selectedLinkID = item.id;
                editLink = true;
              }
            "
            @delete="
              () => {
                selectedLinkID = item.id;
                deleteLink = true;
              }
            "
          />
        </ClientOnly>
      </motion.main>
    </motion.div>
  </AnimatePresence>
</template>
