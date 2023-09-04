<template>
    <div class="card">
        <Button label="Mitarbeiter:innen hinzufügen" icon="pi pi-plus" @click="showDialog" class="mb-2" />
        <Dialog v-model:visible="dialogVisible" position="center" modal header="Header" :style="{ width: '50vw' }">
            <div class="p-fluid">
                <div class="p-field">
                    <label for="firstname">Name</label>
                    <InputText id="firstname" v-model="newUser.firstname" />
                </div>
                <div class="p-field">
                    <label for="lastname">Nachname</label>
                    <InputText id="lastname" v-model="newUser.lastname" />
                </div>
                <div class="p-field">
                    <label for="worktime">Arbeitsstunden</label>
                    <InputText id="worktime" v-model="newUser.worktime" />
                </div>
                <div class="p-field">
                    <label for="email">E-Mail</label>
                    <InputText id="email" v-model="newUser.email" />
                </div>
                <div class="p-field">
                    <label for="description">Info</label>
                    <Textarea id="description" v-model="newUser.description" />
                </div>
            </div>
            <template #footer>
                <Button label="Abbrechen" @click="hideDialog" text />
                <Button label="Speichern" @click="addUser" autofocus />
            </template>
        </Dialog>

        <DataTable :value="users" showGridlines tableStyle="min-width: 50rem">
            <Column v-for="column in columns" :field="column.field" :header="column.header" :key="column.field" />
        </DataTable>
    </div>
</template>
  
<script setup>
import axios from 'axios'
import { ref, reactive } from 'vue'

const columns = [
    { field: 'firstname', header: 'Name' },
    { field: 'lastname', header: 'Nachname' },
    { field: 'worktime', header: 'Arbeitsstunden' },
    { field: 'email', header: 'E-Mail' },
    { field: 'description', header: 'Info' }
]

const dialogVisible = ref(false)
const users = ref([])
const newUser = ref({
    firstname: '',
    lastname: '',
    worktime: '',
    email: '',
    description: ''
})

async function fetchUsers() {
    try {
        const response = await axios.get('http://localhost:3000/api/users')
        users.value = response.data.data
        console.log(users.value)
    } catch (error) {
        console.log(error)
    }
}

async function addUser() {
    try {
        const response = await axios.post('http://localhost:3000/api/users', newUser.value)
        console.log(response.data)
        users.value.push(response.data.data)
        hideDialog()
    } catch (error) {
        console.log(error)
    }
}

function showDialog() {
    dialogVisible.value = true
}

function hideDialog() {
    dialogVisible.value = false
}

fetchUsers()
</script>
  
<style scoped>
/* Add your styles here */
</style>
  