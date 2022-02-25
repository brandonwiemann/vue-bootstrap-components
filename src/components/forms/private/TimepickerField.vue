<template>
    <div class="p-timepicker" @click.stop="() => null">
        <div class="selectors">
            <select
                v-model="hour"
                class="list"
                @change="updateTime"
                :disabled="disabled"
            >
                <option v-for="hour in hours" :value="hour" :key="hour">{{
                    hour
                }}</option>
            </select>
            <span>:</span>
            <select
                v-model="minute"
                class="list"
                @change="updateTime"
                :disabled="disabled"
            >
                <option v-for="min in minutes" :value="min" :key="min">{{
                    min
                }}</option>
            </select>
            <select
                v-model="ampm"
                class="list ampm"
                @change="updateTime"
                :disabled="disabled"
            >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        </div>
    </div>
</template>

<script lang="ts">
import BaseFormField from './BaseFormField.vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { formatDate, getDateObject, parseTimeString } from '@/helpers/datetime.helpers';
import { jsonEquals } from '@/helpers/json.helpers';

@Component({
    name: 'TimepickerField'
})
export default class TimepickerField extends BaseFormField {
    /* Props
	============================================*/

    @Prop({ type: String, required: false })
    readonly format: string;

    @Prop({ type: Number, required: false })
    readonly maxHour: number;

    @Prop({ type: Number, required: false })
    readonly minHour: number;

    @Prop({ type: Number, required: false })
    readonly maxMinute: number;

    @Prop({ type: Number, required: false })
    readonly minMinute: number;

    @Prop({ type: Boolean, required: false })
    readonly returnStringValue: boolean;

    @Prop({ type: [String, Date], required: true })
    readonly value: string | Date;

    /* Computed
	============================================*/

    get hours(): string[] {
        const hours = [];
        for (let i = 1; i < 12; i++) {
            hours.push(i.toString());
        }
        return hours;
    }

    get minutes(): string[] {
        const minutes = [];
        for (let i = 0; i < 60; i += 5) {
            const min = i < 10 ? '0' + i : i.toString();
            minutes.push(min);
        }
        return minutes;
    }

    get timeString(): string {
        return `${this.hour}:${this.minute} ${this.ampm}`;
    }

    /* Data
	============================================*/

    ampm: string = 'AM';
    hour: string = '12';
    minute: string = '00';
    timeOnly: boolean = false;

    /* Methods
	============================================*/

    parseTimeString(time: string): boolean {
        const parsedTime = parseTimeString(time);
        if (parsedTime == null) return false;
        this.hour = parsedTime.hour;
        this.minute = parsedTime.minute;
        this.ampm = parsedTime.ampm;
        this.timeOnly = true;
        return true;
    }

    setAmPm(date: Date) {
        const hour = date.getHours();
        this.ampm = hour >= 12 ? 'PM' : 'AM';
    }

    setHour(date: Date) {
        let hour = date.getHours();
        if (hour >= 12) hour = hour - 12;
        this.hour = hour.toString();
    }

    setMinute(date: Date) {
        const minute = Math.floor(date.getMinutes() / 5) * 5;
        this.minute = minute < 10 ? '0' + minute : minute.toString();
    }

    updateTime() {
        if (this.returnStringValue || this.timeOnly) {
            this.$emit('input', this.timeString);
        } else {
            let dateStr = formatDate(this.value);
            if (!dateStr) return null;
            dateStr = `${dateStr} ${this.timeString}`;
            const newDate = new Date(dateStr);
            newDate.setTime(newDate.getTime());
            this.$emit('input', newDate);
        }
    }

    updateInitialValues() {
        if (!this.value) return;
        if (typeof this.value === 'string' && this.parseTimeString(this.value)) {
            return this.updateTime();
        }
        const date = getDateObject(this.value);
        if (!date) return;
        this.setHour(date);
        this.setMinute(date);
        this.setAmPm(date);
        this.updateTime();
    }

    validate() {
        return Promise.resolve(true);
    }

    /* Lifecycle Hooks
	============================================*/

    mounted() {
        this.updateInitialValues();
    }

    /* Watchers
	============================================*/

    @Watch('value')
    onValueChange(newVal: any, oldVal: any) {
        if (!jsonEquals(newVal, oldVal)) {
            this.updateInitialValues();
        }
    }
}
</script>

<style scoped>
.selectors {
	display: inline-block;
}
.selectors > span {
	float: left;
	display: block;
}
.selectors .ampm {
	margin-left: 10px;
}
.selectors .list {
	background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNC45NSIgaGVpZ2h0PSIxMCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxLjQxIDQuNjcgMi40OCAzLjE4IDMuNTQgNC42NyAxLjQxIDQuNjciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMy41NCA1LjMzIDIuNDggNi44MiAxLjQxIDUuMzMgMy41NCA1LjMzIi8+PC9zdmc+)
		no-repeat 95% 50%;
	background-color: #fff;
	border: 1px solid #ccc;
	border-radius: 4px;
	float: left;
	width: 50px;
	padding: 5px 8px;
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
}
.selectors span {
	font-size: 22px;
	margin: 0 5px;
}
</style>
