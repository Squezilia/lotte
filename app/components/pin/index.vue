<script setup lang="ts">
import { LockOpen } from 'lucide-vue-next';
import { motion, useTransform, type MotionValue } from 'motion-v';

const props = defineProps<{
  y: MotionValue;
}>();

const lockOpacity = useTransform(props.y, [0, 75], [0, 1]);
</script>

<template>
  <ClientOnly>
    <motion.div
      :style="{ opacity: lockOpacity }"
      class="absolute z-0 top-0 left-0 flex pt-8 justify-center h-100 w-screen bg-emerald-600"
    >
      <LockOpen />
    </motion.div>
  </ClientOnly>
</template>
