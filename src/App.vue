<template>
  <div class="">
    <div class="bg-white rounded-lg shadow-xl mx-4 sm:mx-0">
      <BarGraph :selected-graphs="selectedGraphs" :chart-data="data" :added-data-point="addedDataPoint" />
    </div>
    <div class="bg-white rounded-lg shadow-xl p-6 mx-4 sm:mx-0">
      <div>
        <p class="mb-4 text-black font-bold">Select Graphs:</p>
        <div class="flex justify-center">
          <div class="flex">
            <input type="checkbox" v-model="selectedGraphs" name="selectedGraphs" value="max" class="w-4 h-4 mr-2 h-fit my-auto accent-button-color">
            <p class="mr-2 text-black">Max</p>
          </div>
          <div class="flex">
            <input type="checkbox" v-model="selectedGraphs" name="selectedGraphs" value="min" class="w-4 h-4 mr-2 h-fit my-auto accent-button-color">
            <p class="mr-2 text-black">Min</p>
          </div>
          <div class="flex">
            <input type="checkbox" v-model="selectedGraphs" name="selectedGraphs" value="mean" class="w-4 h-4 mr-2 h-fit my-auto accent-button-color">
            <p class="mr-2 text-black">Mean</p>
          </div>
        </div>
      </div>
      <form @submit.prevent="addDataPoint" class="mt-4">
        <p class="mb-4 text-black font-bold text-sm">Enter Day and temparature to add data points in graph:</p>
        <div class="flex flex-col sm:grid sm:gap-3 sm:grid-cols-2 ">
          <label class="text-black mb-2 sm:mb-0">
            Day:
            <select v-model="newData.day" @change="autoFillData" placeholder="Select day" class="ml-1 sm:ml-0">
              <option :value="val" v-for="(val, index) in dayOptions" :key="index">{{ val }}</option>
            </select>
          </label>
          <label class="text-black mb-2 sm:mb-0">
            Min:
            <input v-model="newData.min" type="number" required class="w-56 ml-2 sm:ml-3" />
          </label>
          <label class="text-black mb-2 sm:mb-0">
            Max:
            <input v-model="newData.max" type="number" required class="w-56 ml-1 sm:ml-0" />
          </label>
          <label class="text-black mb-2 sm:mb-0">
            Mean:
            <input v-model="newData.mean" type="number" required class="w-56" />
          </label>
        </div>
        <button type="submit" class="mt-4 bg-button-color">Add data point</button>
      </form>
    </div>
  </div>
</template>

<script>
import BarGraph from './components/BarGraph.vue'

export default {
  name: 'App',
  components: {
    BarGraph
  },
  data() {
    return {
      selectedGraphs: ['mean'],
      data: [
        { day: 'Sun', min: 25, max: 40, mean: 20 },
        { day: 'Mon', min: 18, max: 44, mean: 33 },
        { day: 'Tue', min: 23, max: 36, mean: 30 },
      ],
      dayOptions: [
        "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"
      ],
      newData: { day: 'Select Day', min: 0, max: 0, mean: 0 },
      addedDataPoint: false
    }
  },
  methods: {
    autoFillData(e) {
      let val = e.target.value
      let existing = this.data.find(v => v.day == val)
      if (!existing) {
        this.newData = {
          day: val, min: 0, max: 0, mean: 0
        }
      }

      this.newData = { ...this.newData, ...existing }
    },
    addDataPoint() {
      let existing = this.data.findIndex(v => v.day == this.newData.day)
      if (existing > -1) {
        // Update array if day already exists
        this.data[existing] = {
          ...this.data[existing],
          ...this.newData
        }
      } else {
        // Add new data in array if day does not exists
        this.data.push({ ...this.newData })
      }
      this.newData = { day: '', min: 0, max: 0, mean: 0 }
      this.addedDataPoint = true
    },
  }
}
</script>

<style scoped lang="postcss">
button {
  @apply mt-6 mx-3 rounded-md py-2 px-6 text-white font-bold shadow-xl
}

input {
  @apply shadow-md rounded-sm border-slate-300 border py-1 px-2
}

select {
  @apply w-56 py-1.5 px-2 border-slate-300 border shadow-md rounded-sm
}
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto 0;
  width: fit-content;
}
</style>
