import FormValidator from '@/classes/FormValidator';
import Vue from 'vue';

declare module 'vue/types/vue' {
    interface Vue {
        $validator: FormValidator;
    }
    interface VueConstructor {
        $validator: FormValidator;
    }
}