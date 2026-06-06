import { toast } from 'vue-sonner';

export const useLinks = () => {
  const editState = useState('edit:enabled', () => false);
  const editPIN = useState<null | string>('edit:pin', () => null);
  const links = useFetch('/api/link', { method: 'GET' });

  return {
    state: editState,
    pin: editPIN,
    links,
    setPIN(pin: string) {
      editPIN.value = pin;
    },
    checkPIN(pin?: string) {
      return useFetch('/api/check-signature', {
        method: 'POST',
        body: {
          pin: pin || editPIN.value,
        },
        onResponseError(ctx) {
          toast.error(ctx.response._data?.message || 'PIN Doğrulanamadı.');
        },
      });
    },
  };
};
