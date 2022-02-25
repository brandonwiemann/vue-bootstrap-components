import Vue from 'vue';
import FormValidator from '@/classes/FormValidator';

declare module 'vue/types/vue' {
  interface Vue {
    $validator: FormValidator;
  }
  interface VueConstructor {
    $validator: FormValidator;
  }
}