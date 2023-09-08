<template>
    <div>
        <h3 class="my-3">Mitarbeiter: {{ users.firstname }} {{ users.lastname }}</h3>
        <FullCalendar :options="calendarOptions" />
    </div>
</template>
  
<script setup>
import { useNuxtApp } from '#app';
const { $config } = useNuxtApp();
const baseUrl = $config.baseURL;
const usersEndpoint = $config.usersEndpoint;
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import FullCalendar from '@fullcalendar/vue3'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import deLocale from '@fullcalendar/core/locales/de';
import { INITIAL_EVENTS } from '../../utils/event-utils'

const route = useRoute()
const user = route.params.user
const users = ref([])
console.log('helloid', user)

onMounted(async () => {
    try {
        const userResponse = await axios.get('http://localhost:3000/api/users/' + user);
        users.value = userResponse.data.body;

        console.log('User', users.value);

        calendarOptions.value.events = users.value.events;
    } catch (error) {
        console.log(error);
    }
});

const calendarOptions = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: deLocale,
    slotMinTime: '04:00:00',
    slotMaxTime: '20:00:00',
    initialEvent: INITIAL_EVENTS,
    editable: false,
    selectable: false,
    selectMirror: true,
    unselectAuto: false,
    dayMaxEvents: true,
    weekends: true,
    allDaySlot: false,
    height: 870,
    themeSystem: 'bootstrap5',
    eventContent: function (arg) {
        let title = arg.event.title;
        let extendedProps = arg.event.extendedProps || {};
        let description = extendedProps.description || "Keine Beschreibung"; // Standardwert, falls keine Beschreibung vorhanden ist
        let html = `
        <div class="fc-event-inner">
          <div class="fc-event-title">${title}</div>
          <div class="fc-event-description">${description}</div>
        </div>
      `;
        return { html: html };
    }
});
</script>
  
<style scoped></style>