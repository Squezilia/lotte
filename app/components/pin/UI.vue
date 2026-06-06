<script setup lang="ts">
import { motion } from 'motion-v';
import { InputOTP, InputOTPGroup } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'vue-input-otp';
import { ArrowLeft, Lock } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import PINOTPSlot from './OTPSlot.vue';

const emit = defineEmits<{
  closeModal: [];
}>();

const links = useLinks();

const pin = ref<string>('');
const inputDisabled = ref(false);
const inputError = ref(false);

watch(pin, async (newVal) => {
  if (newVal.length === 6) {
    inputDisabled.value = true;
    inputError.value = false;
    const result = await links.checkPIN(newVal);

    if (result.status.value !== 'success') {
      pin.value = '';
      inputError.value = true;
      setTimeout(() => {
        inputError.value = false;
      }, 10000);
      return (inputDisabled.value = false);
    }

    links.setPIN(newVal);
    links.state.value = true;
    setTimeout(() => {
      emit('closeModal');
    }, 500);
  }
});

onMounted(() => {
  window.document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  window.document.body.style.overflow = 'auto';
});
</script>

<template>
  <motion.div
    :initial="{
      opacity: 0,
    }"
    :animate="{
      opacity: 1,
    }"
    :exit="{
      opacity: 0,
    }"
    :transition="{
      duration: 0.3,
      ease: [0.33, 1, 0.68, 1],
    }"
    class="fixed z-20 top-0 left-0 w-screen h-screen bg-background/20 flex flex-col backdrop-blur-sm pt-40 items-center"
  >
    <motion.div
      :initial="{ top: 80, opacity: 0, scale: 0.95 }"
      :animate="{ top: 0, opacity: 1, scale: 1 }"
      :transition="{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }"
      class="relative mb-4"
    >
      <Lock class="size-6" />
    </motion.div>
    <motion.div
      :initial="{ top: 80, opacity: 0, scale: 0.95 }"
      :animate="{ top: 0, opacity: 1, scale: 1 }"
      :transition="{ delay: 0.05, duration: 0.35, ease: [0.33, 1, 0.68, 1] }"
      class="flex relative items-center mb-6 gap-2.5"
    >
      <Button variant="ghost" size="icon" @click="emit('closeModal')">
        <ArrowLeft />
      </Button>

      <h1 class="text-2xl font-black">Düzenleme Modu</h1>
    </motion.div>
    <motion.div
      :initial="{ top: 80, opacity: 0, scale: 0.95 }"
      :animate="{ top: 0, opacity: 1, scale: 1 }"
      :transition="{ delay: 0.075, duration: 0.35, ease: [0.33, 1, 0.68, 1] }"
      class="relative"
    >
      <InputOTP
        v-model="pin"
        :disabled="inputDisabled"
        :pattern="REGEXP_ONLY_DIGITS"
        :maxlength="6"
      >
        <InputOTPGroup
          :data-input-error="inputError"
          class="data-[input-error=true]:animate-deny gap-2 data-[input-error=true]:border-destructive group/otp"
        >
          <PINOTPSlot :index="0" />
          <PINOTPSlot :index="1" />
          <PINOTPSlot :index="2" />
          <PINOTPSlot :index="3" />
          <PINOTPSlot :index="4" />
          <PINOTPSlot :index="5" />
        </InputOTPGroup>
      </InputOTP>
    </motion.div>
  </motion.div>
</template>
