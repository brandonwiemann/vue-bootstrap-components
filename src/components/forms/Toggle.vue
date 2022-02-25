<template>
    <div>
        <div :class="['vue-ios-switch form-group', {'disabled': disabled}]">
            <div v-if="!isHorizontal">
                <input
                    data-test="checkbox"
                    @change="$emit('input', !value)"
                    type='checkbox'
                    :id="id"
                    :checked="value"
                    :disabled="disabled"
                    :class="[color, 'ios-switch', {'ios-switch-lg': size == 'lg', 'ios-switch-sm': size == 'sm'}]"
                />
                <label :for="id">
                    <span v-if="label">{{ label }}</span>
                    <span v-if="!label">&nbsp;</span>
                </label>
                <span class="bf-helper-text" v-if="helpText" data-test="help-text">
                    {{helpText}}
                </span>
            </div>
            <div v-if="isHorizontal">
                <label class="col-sm-3 control-label">{{label}}</label>
                <div class="col-sm-9 horizontal">
                    <div>
                        <input
                            data-test="checkbox"
                            @change="$emit('input', !value)"
                            type='checkbox'
                            :id="id"
                            :checked="value"
                            :disabled="disabled"
                            :class="[color, 'ios-switch', {'ios-switch-lg': size == 'lg', 'ios-switch-sm': size == 'sm'}]"
                        />
                        <label :for="id">&nbsp;</label>
                    </div>
                    <div class="bf-helper-text bf-helper-below" v-if="helpText" data-test="help-text">
                        {{helpText}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import BaseFormField from './private/BaseFormField.vue';
import { AnyObject } from '@/types/generic';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'Toggle',
})
export default class Toggle extends BaseFormField {

    /* Props
	============================================*/

    @Prop({ type: String, required: false, default: 'blue' })
    readonly color: string;

    @Prop({ type: [Boolean, Object], required: false })
    readonly selected: boolean | AnyObject;

    @Prop({ type: String, required: false, default: '' })
    readonly size: string;

    @Prop({ type: Boolean, required: true })
    readonly value: boolean;

    validate(): Promise<boolean> {
        return Promise.resolve(true);
    }

}

</script>

<style lang="less" scoped>
	.vue-ios-switch {
		min-height: 36px;
		&.disabled {
			cursor: not-allowed;
			opacity: 0.5;
			input[type="checkbox"].ios-switch + label:before,
			input[type="checkbox"].ios-switch + label:after {
				cursor: not-allowed;
			}
		}
    }
	.vue-ios-switch label {
		user-select: none !important;
	}
    input[type="checkbox"].ios-switch {
		visibility: hidden;
        position: absolute;
        margin: 8px 0 0 16px;
    }
    input[type="checkbox"].ios-switch + label {
        cursor: pointer;
        position: relative;
        padding: 0 0 0 50px;
        line-height: 2.0em;
    }
    input[type="checkbox"].ios-switch + label:before {
        cursor: pointer;
        content: "";
        position: absolute;
        display: block;
        left: 0;
        top: 0;
        width: 40px; /* x*5 */
        height: 24px; /* x*3 */
        border-radius: 16px; /* x*2 */
        background: #fff;
        border: 1px solid #d9d9d9;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
    }
    input[type="checkbox"].ios-switch + label:after {
        cursor: pointer;
        content: "";
        position: absolute;
        display: block;
        left: 0px;
        top: 0px;
        width: 24px; /* x*3 */
        height: 24px; /* x*3 */
        border-radius: 16px; /* x*2 */
        background: #fff;
        border: 1px solid #d9d9d9;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
    }
    input[type="checkbox"].ios-switch + label:hover:after {
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
    }
    input[type="checkbox"].ios-switch:checked + label:after {
        margin-left: 16px;
    }

    input[type="checkbox"].ios-switch:checked + label:before {
        background: #1993FC;
    }

    input[type="checkbox"].green.ios-switch:checked + label:before {
        background: #55D069;
    }

    /* SMALL */

    input[type="checkbox"].ios-switch-sm {
        margin: 5px 0 0 10px;
    }
    input[type="checkbox"].ios-switch-sm + label {
        position: relative;
        padding: 0 0 0 32px;
        line-height: 1.3em;
    }
    input[type="checkbox"].ios-switch-sm + label:before {
        width: 25px; /* x*5 */
        height: 15px; /* x*3 */
        border-radius: 10px; /* x*2 */
    }
    input[type="checkbox"].ios-switch-sm + label:after {
        width: 15px; /* x*3 */
        height: 15px; /* x*3 */
        border-radius: 10px; /* x*2 */
    }
    input[type="checkbox"].ios-switch-sm + label:hover:after {
        box-shadow: 0 0 3px rgba(0,0,0,0.3);
    }
    input[type="checkbox"].ios-switch-sm:checked + label:after {
        margin-left: 10px; /* x*2 */
    }

    /* LARGE */

    input[type="checkbox"].ios-switch-lg {
        margin: 10px 0 0 20px;
    }
    input[type="checkbox"].ios-switch-lg + label {
        position: relative;
        padding: 7px 0 0 60px;
        line-height: 2.3em;
    }
    input[type="checkbox"].ios-switch-lg + label:before {
        width: 50px; /* x*5 */
        height: 30px; /* x*3 */
        border-radius: 20px; /* x*2 */
    }
    input[type="checkbox"].ios-switch-lg + label:after {
        width: 30px; /* x*3 */
        height: 30px; /* x*3 */
        border-radius: 20px; /* x*2 */
    }
    input[type="checkbox"].ios-switch-lg + label:hover:after {
        box-shadow: 0 0 8px rgba(0,0,0,0.3);
    }
    input[type="checkbox"].ios-switch-lg:checked + label:after {
        margin-left: 20px; /* x*2 */
	}

	.horizontal {
		align-items: center;
		padding-left: 12px;
		display: flex;
		position: relative;
		top: 5px;

		input[type="checkbox"].ios-switch {
			height: 0px;
			margin: 0;
			padding: 0;
		}

		label {
			height: 16px;
		}
    }

	.bf-helper-text {
		color: #999999;
		font-size: 12px;
		font-weight: normal;
		margin-left: 3px;
	}
	.bf-helper-text.bf-helper-below {
		margin-left: 0px;
	}
</style>