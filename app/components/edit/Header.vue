<script setup lang="ts">
import { motion } from 'motion-v';
import { Button } from '../ui/button';
import { Plus, RotateCcwKey } from 'lucide-vue-next';
</script>

<template>
  <motion.div
    :initial="{ top: -40 }"
    :animate="{ top: 0 }"
    :exit="{ top: -40 }"
    class="h-14 px-2.5 z-10 relative bg-background border-b flex items-center"
  >
    <span class="text-lg font-black">Düzenleme Modu</span>
    <div class="ml-auto">
      <EditChangePIN>
        <Button size="icon">
          <RotateCcwKey />
        </Button>
      </EditChangePIN>
      <EditNewLink>
        <Button size="icon">
          <Plus />
        </Button>
      </EditNewLink>
    </div>
  </motion.div>
</template>
