import Vue from 'vue'
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs'

Vue.component('BarChart', {
    extends: Bar,
    props: ['data', 'options'],
    mounted() {
        this.renderChart(this.data, this.options)
    }
})

Vue.component('LineChart', {
    extends: Line,
    props: ['data', 'options'],
    mounted() {
        this.renderChart(this.data, this.options)
    }
})

Vue.component('PieChart', {
    extends: Pie,
    props: ['data', 'options'],
    mounted() {
        this.renderChart(this.data, this.options)
    }
})

Vue.component('DoughnutChart', {
    extends: Doughnut,
    props: ['data', 'options'],
    mounted() {
        this.renderChart(this.data, this.options)
    }
})
