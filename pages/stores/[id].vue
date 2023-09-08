<template>
  <div>
    <h1>{{ stores.name }}</h1>
    <FullCalendar :options="calendarOptions" />
    <Dialog v-model:visible="dialogVisible" position="center" modal header="Mitarbeiter:inn planen" @hide="closeDialog"
      :style="{ width: '50vw' }">
      <div class="p-fluid">
        <div class="p-field">
          <label for="dropdown">Mitarbeiter:inn:</label>
          <Dropdown id="dropdown" v-model="selectedUser" :options="userNames" placeholder="Wählen Sie einen Benutzer"
            option-label="label" option-value="value" />
        </div>
        <div class="p-field">
          <label for="description">Beschreibung:</label>
          <Textarea id="description" v-model="eventDescription" rows="3" />
        </div>
      </div>
      <template #footer>
        <Button label="Abbrechen" @click="closeDialog" />
        <Button label="Speichern" @click="saveEvent" autofocus />
      </template>
    </Dialog>
    <Dialog v-model:visible="confirmDialogVisible" position="center" modal header="Event löschen" @hide="closeDialog"
      :style="{ width: '30vw' }">
      <p>Möchten Sie dieses Event wirklich löschen?</p>
      <template #footer>
        <Button label="Abbrechen" @click="closeConfirmDialog" />
        <Button label="Löschen" @click="confirmDeleteEvent" class="p-button-danger" />
      </template>
    </Dialog>
  </div>
</template>
  
<script setup>
import { useNuxtApp } from '#app';
const { $config } = useNuxtApp();
const baseUrl = $config.baseURL;
const storesEndpoint = $config.storesEndpoint;
const usersEndpoint = $config.usersEndpoint;
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FullCalendar from '@fullcalendar/vue3'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import deLocale from '@fullcalendar/core/locales/de';
import { INITIAL_EVENTS } from '../../utils/event-utils'
import { v4 as uuidv4 } from 'uuid';


const dialogVisible = ref(false)

const route = useRoute()
const id = route.params.id
const stores = ref([])

const users = ref([])
const userNames = ref([])

const selectedUser = ref('');
const selectedInfo = ref(null);
const eventDescription = ref('');

const confirmDialogVisible = ref(false)
const eventToDelete = ref(null)

const closeConfirmDialog = () => {
  confirmDialogVisible.value = false;
}

const confirmDeleteEvent = async () => {
  if (eventToDelete.value) {
    await deleteEvent(eventToDelete.value);
  }
  closeConfirmDialog();
}

const closeDialog = () => {
  dialogVisible.value = false;
  if (selectedInfo.value && selectedInfo.value.view) {
    const calendarApi = selectedInfo.value.view.calendar;
    calendarApi.unselect(); // Fügt die Unselect-Funktion von FullCalendar API hinzu
  }
}

onMounted(async () => {
  try {
    const storesResponse = await axios.get('http://localhost:3000/api/stores/' + id);
    stores.value = storesResponse.data.body;

    calendarOptions.value.events = stores.value.events;

    const usersResponse = await axios.get('http://localhost:3000/api/users');
    users.value = usersResponse.data.data;
    userNames.value = users.value.map(user => ({ label: `${user.firstname} ${user.lastname}`, value: user }));
    console.log(userNames.value);
  } catch (error) {
    console.log(error);
  }
});

const handleDateSelect = (info) => {

  selectedInfo.value = info;
  const calendarApi = selectedInfo.value.view.calendar;
  dialogVisible.value = true
};

const handleEventClick = (clickInfo) => {
  eventToDelete.value = clickInfo;
  confirmDialogVisible.value = true;
};

const saveEvent = async () => {
  const calendarApi = selectedInfo.value.view.calendar;
  let title;

  calendarApi.unselect()

  if (selectedUser.value && selectedUser.value.firstname) {
    title = `${selectedUser.value.firstname} ${selectedUser.value.lastname}`;
  } else {
    return;
  }

  if (title) {
    const newEvent = {
      id: uuidv4(),
      title: title,
      start: selectedInfo.value.startStr,
      end: selectedInfo.value.endStr,
      allDay: selectedInfo.value.allDay,
      color: getRandomDarkColor(),
      extendedProps: {
        description: eventDescription.value
      }
    };
    stores.value.events.push(newEvent);
    calendarApi.addEvent(newEvent);

    try {
      await axios.put('http://localhost:3000/api/stores/' + id, { events: stores.value.events });
    } catch (error) {
      console.error('Fehler beim Speichern des Ereignisses:', error);
    }

    // Speichern des Ereignisses im Benutzermodell
    try {
      console.log(selectedUser.value._id)
      if (selectedUser.value && selectedUser.value._id) {
        const user = users.value.find(user => user._id === selectedUser.value._id);
        if (user) {
          user.events.push(newEvent);
          await axios.put(`http://localhost:3000/api/users/${user._id}`, user);
          console.log('Ereignis erfolgreich im Benutzermodell gespeichert.');
        } else {
          console.error('Benutzer nicht gefunden.');
        }
      } else {
        console.error('Benutzer-ID fehlt.');
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Ereignisses im Benutzermodell:', error);
    }

  } else {
    console.log('Event not saved. Title is missing.');
  }

  selectedUser.value = null;
  eventDescription.value = '';
  dialogVisible.value = false
};

const deleteEvent = async (clickInfo) => {
  const eventId = clickInfo.event.id;
  clickInfo.event.remove();

  stores.value.events = stores.value.events.filter(event => event.id !== eventId);

  try {
    await axios.put('http://localhost:3000/api/stores/' + id, { events: stores.value.events });
  } catch (error) {
    console.error('Fehler beim Löschen des Ereignisses aus den Stores:', error);
  }

  // Löschen des Ereignisses aus der Benutzerdatenbank
  try {
    users.value.forEach(async user => {
      if (user.events.some(event => event.id === eventId)) {
        user.events = user.events.filter(event => event.id !== eventId);
        await axios.put(`http://localhost:3000/api/users/${user._id}`, user);
      }
    });
    console.log('Ereignis erfolgreich aus der Benutzerdatenbank gelöscht.');
  } catch (error) {
    console.error('Fehler beim Löschen des Ereignisses aus der Benutzerdatenbank:', error);
  }
}

const updateEvent = async (resizeInfo) => {
  const eventId = resizeInfo.event.id;

  // Update Color
  const newColor = getRandomDarkColor();

  // Update Event with new Color
  resizeInfo.event.setProp('color', newColor);

  stores.value.events = stores.value.events.map(event => {
    if (event.id === eventId) {
      // Aktualisieren der relevanten Event Eigenschaften
      return {
        ...event,
        start: resizeInfo.event.start,
        end: resizeInfo.event.end,
        color: newColor
      };
    }
    return event;
  });

  try {
    await axios.put('http://localhost:3000/api/stores/' + id, { events: stores.value.events });
    console.log('Ereignis aktualisiert');
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Ereignisses:', error);
  }

  // Update the event in the user database
  try {
    users.value.forEach(async user => {
      if (user.events.some(event => event.id === eventId)) {
        user.events = user.events.map(event => {
          if (event.id === eventId) {
            return {
              ...event,
              start: resizeInfo.event.start,
              end: resizeInfo.event.end,
              color: newColor
            };
          }
          return event;
        });
        await axios.put(`http://localhost:3000/api/users/${user._id}`, user);
      }
    });
    console.log('Ereignis in der Benutzerdatenbank aktualisiert');
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Ereignisses in der Benutzerdatenbank:', error);
  }
}

function getRandomDarkColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    let randomIndex = Math.floor(Math.random() * 8);
    color += letters[randomIndex];
  }
  return color;
}

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridDay',
  locale: deLocale,
  slotMinTime: '04:00:00',
  slotMaxTime: '20:00:00',
  initialEvent: INITIAL_EVENTS,
  editable: true,
  selectable: true,
  selectMirror: true,
  unselectAuto: false,
  dayMaxEvents: true,
  weekends: true,
  allDaySlot: false,
  height: 800,
  themeSystem: 'bootstrap5',
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventResize: updateEvent,
  eventContent: function (arg) {
    let title = arg.event.title;
    let extendedProps = arg.event.extendedProps || {};
    let description = extendedProps.description || "Keine Beschreibung"; // Standardwert, falls keine Beschreibung vorhanden ist
    let html = `
      <div class="fc-event-inner">
        <div class="fc-event-title">${title}</div>
        <div class="fc-event-description">${description}</div>
        <p-button icon="pi pi-trash" class="fc-event-delete" onclick=""></p-button>
      </div>
    `;
    return { html: html };
  }
});

</script>
  
<style>
.fc-day-today {
  background-color: #fffff2 !important;
}

.fc .fc-col-header-cell-cushion {
  display: inline-block;
  padding: 10px 7px;
}
</style>
  