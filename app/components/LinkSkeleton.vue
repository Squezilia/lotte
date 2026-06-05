<script setup lang="ts">
import { Skeleton } from './ui/skeleton';
</script>

<template>
  <div
    class="border rounded-xl bg-background w-full flex items-center h-20 p-2.5 gap-2.5"
  >
    <Skeleton class="aspect-square h-full w-auto" />
    <div class="flex flex-col gap-2.5">
      <Skeleton class="h-5 w-24 rounded-sm" />
      <Skeleton class="h-4 w-20 rounded-sm" />
    </div>
  </div>
</template>
