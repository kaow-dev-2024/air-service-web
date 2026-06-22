import Vue from 'vue';
import PrimeVue from 'primevue/config';

// PrimeVue Components
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
// import Chart from 'primevue/chart';

// Styles
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

Vue.use(PrimeVue);

Vue.component('Card', Card);
Vue.component('DataTable', DataTable);
Vue.component('Column', Column);
Vue.component('Tag', Tag);
// Vue.component('Chart', Chart);
