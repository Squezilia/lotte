<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { InputOTPSlot } from '../ui/input-otp';
import { reactiveOmit } from '@vueuse/core';
import { useForwardProps } from 'reka-ui';
import { cn } from '~/lib/utils';

const props = defineProps<{ index: number; class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <InputOTPSlot
    v-bind="forwarded"
    :class="
      cn(
        'text-xl h-11 w-9 group-data-[input-error=true]/otp:border-destructive border-x rounded-lg',
        props.class
      )
    "
  />
</template>
