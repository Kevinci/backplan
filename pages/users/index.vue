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

        <DataTable v-model:editingRows="editingRows" :value="users" tableClass="editable-cells-table" showGridlines
            tableStyle="min-width: 50rem" editMode="row" @row-edit-save="onRowEditSave" :loading="loading">
            <Column field="firstname" header="Name" sortable style="width: 20%">
                <template #body="slotProps">
                    <NuxtLink class="table-link" :to="'users/' + slotProps.data['_id']">
                        {{ slotProps.data['firstname'] }}
                    </NuxtLink>
                </template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>

            <Column field="lastname" header="Nachname" sortable style="width: 20%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column field="worktime" header="Arbeiststunden" :sortable="true">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column field="worktime" header="Arbeiststunden" :sortable="true">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column field="description" header="Information" :sortable="true">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column :rowEditor="true" severity="success" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"
                header="Actions">
            </Column>
        </DataTable>
    </div>
</template>
  
<script setup>
import axios from 'axios'
import { ref, reactive } from 'vue'
const config = useRuntimeConfig();

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
        const response = await axios.get(`${config.public.BASE_URL}${config.public.USERS_ENDPOINT}`);
        users.value = response.data.data
        console.log(users.value)
    } catch (error) {
        console.log(error)
    }
}

async function addUser() {
    try {
        const response = await axios.post(`${config.public.BASE_URL}${config.public.USERS_ENDPOINT}`, newUser.value)
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
  