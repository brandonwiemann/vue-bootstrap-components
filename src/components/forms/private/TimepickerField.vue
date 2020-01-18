<template>
    <div class="p-timepicker" v-on:click.stop="() => null">
		<div class="selectors">
			<select v-model="hour" class="list" v-on:change="updateTime" :disabled="disabled">
				<option v-for="hour in hours" :value="hour" :key="hour">{{hour}}</option>
			</select>
			<span>:</span>
			<select v-model="minute" class="list" v-on:change="updateTime" :disabled="disabled">
				<option v-for="min in minutes" :value="min" :key="min">{{min}}</option>
			</select>
			<select v-model="ampm" class="list ampm" v-on:change="updateTime" :disabled="disabled">
				<option value="AM">AM</option>
				<option value="PM">PM</option>
			</select>
		</div>
    </div>
</template>

<script>
    import FormField from '../private/FormField.vue';
    const DATE_FORMAT_REGEX = /[(\d)]{1,2}(\/|\-)[\d]{1,2}(\/|\-)[(\d)]{2,4}/;
    export default {
        extends: { ...FormField },
        name: 'TimepickerField',
        props: {
            format: String,
            minHour: Number,
            maxHour: Number,
			minMinute: Number,
			maxMinute: Number,
			returnStringValue: Boolean,
        },
		data() {
			return {
				ampm: "AM",
				hour: "12",
                hours: [],
				minute: "00",
				minutes: [],
                timeOnly: false
			}
		},
        methods: {

			parseTimeString(time) {
                if (!time
                    || typeof time !== 'string'
                    || time.indexOf(':') === -1
                    || this.isValidDate(new Date(time))
                ) return false;
				let timeArray = time.split(':');
				if (timeArray.length < 2) return false;
				let ampm = null;
				if (time.toLowerCase().indexOf('am') > -1) ampm = 'AM';
				else if (time.toLowerCase().indexOf('pm') > -1) ampm = 'PM';

				let hour = Number(timeArray[0]);

				if (ampm === null) {
					ampm = 'AM';
					if (hour <= 0) hour = 12;
					else if (hour > 12) {
						hour = hour - 12;
						ampm = 'PM'
					}
				}

				this.hour = hour.toString();
				this.minute = timeArray[1].substring(0,2);
				this.ampm = ampm;
				this.timeOnly = true;
				return true;
			},

			getFormattedDate() {
                try {
                    if(!this.value || !this.isValidDate(this.value)) return null;
                    let today = this.value;
                    let dd = today.getDate();
                    let mm = today.getMonth()+1;
                    let yyyy = today.getFullYear();
                    if(dd < 10) dd='0'+dd;
                    if(mm < 10) mm='0'+mm;
                    return mm+'/'+dd+'/'+yyyy;
                } catch(e) {
                    console.warn('Could not get formatted date: ' + e.message);
                    return null;
                }
			},

			isValidDate(date) {
				if (Object.prototype.toString.call(date) === "[object Date]") {
					return !isNaN(date.getTime());
				} else if(typeof date === "string") {
					return this.isValidDate(new Date(date));
				}
				return false;
			},

			updateTime() {
				if (this.returnStringValue || this.timeOnly) {
					let timeStr = `${this.hour}:${this.minute} ${this.ampm}`;
					this.$emit("input", timeStr);
				} else {
					let dateStr = this.getFormattedDate();
					if(!dateStr) return null;
					let timeStr = `${this.hour}:${this.minute} ${this.ampm}`;
					dateStr = `${dateStr} ${timeStr}`;
					let newDate = new Date(dateStr);
					newDate.setTime(newDate.getTime());
					this.$emit('input', newDate);
				}
			},

			updateInitialValues() {
				if (!this.value) return;
				if (this.parseTimeString(this.value)) {
					this.updateTime();
					return;
				}
				if (!this.isValidDate(this.value)) return;
				let d = (typeof this.value === "string") ? new Date(this.value) : this.value;
				let hour = d.getHours();
				let minute = d.getMinutes();
				minute = Math.floor(minute/5)*5;
				this.minute = minute < 10 ? "0" + minute : minute.toString();
				if (hour >= 12) {
					hour = hour - 12;
					this.ampm = "PM";
				} else {
					this.ampm = "AM";
				}
				if (hour <= 0) hour = 12;
				this.hour = hour.toString();
				this.updateTime();
			},

			validate() {
				return new Promise((resolve, reject) => {
					resolve(true);
				});
			}
        },
		created() {
			this.hours.push('12');
			for(let i=1;i<12;i++) {
				this.hours.push(i.toString());
			}
			for(let i=0;i<60;i+=5) {
				let min = i < 10 ? "0" + i : i.toString();
				this.minutes.push(min);
			}
		},
		mounted() {
			this.updateInitialValues();
		},
		watch: {
			'value': function(newVal, oldVal) {
				if (oldVal == null
                    || newVal == null
                    || (newVal.toString() !== oldVal.toString())
                ) {
                    this.updateInitialValues();
				}
			}
		}
	};
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
		background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNC45NSIgaGVpZ2h0PSIxMCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxLjQxIDQuNjcgMi40OCAzLjE4IDMuNTQgNC42NyAxLjQxIDQuNjciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMy41NCA1LjMzIDIuNDggNi44MiAxLjQxIDUuMzMgMy41NCA1LjMzIi8+PC9zdmc+) no-repeat 95% 50%;
		background-color: #FFF;
		border: 1px solid #ccc;
		border-radius: 4px;
		float: left;
		width: 50px;
		padding: 5px 8px;
		appearance: none;
		-webkit-appearance:none;
		-moz-appearance: none;
		-webkit-appearance: none;
	}
	.selectors span {
		font-size: 22px;
		margin: 0 5px;
	}
</style>