<template>
    <div v-if="stores" class="card">
        <Button label="Bäckerei hinzufügen" icon="pi pi-plus" @click="showDialog" class="mb-2" />
        <Dialog v-model:visible="dialogVisible" position="center" modal header="Header" :style="{ width: '50vw' }">
            <div class="p-fluid">
                <div class="p-field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model="newStore.name" />
                </div>
                <div class="p-field">
                    <label for="location">Ort</label>
                    <InputText id="location" v-model="newStore.location" />
                </div>
                <div class="p-field">
                    <label for="description">Anmerkung</label>
                    <InputText id="description" v-model="newStore.description" />
                </div>
            </div>
            <template #footer>
                <Button label="Abbrechen" @click="hideDialog" text />
                <Button label="Speichern" @click="addStore" autofocus />
            </template>
        </Dialog>

        <DataTable v-model:editingRows="editingRows" :value="stores" tableClass="editable-cells-table" showGridlines
            tableStyle="min-width: 50rem" editMode="row" @row-edit-save="onRowEditSave" :loading="loading">
            <Column field="name" header="Name" sortable style="width: 20%">
                <template #body="slotProps">
                    <NuxtLink class="table-link" :to="'stores/' + slotProps.data['_id']">
                        {{ slotProps.data['name'] }}
                    </NuxtLink>
                </template>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>

            <Column field="location" header="Ort" sortable style="width: 20%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column field="description" header="Anmerkung" :sortable="true">
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

const editingRows = ref([]);
const loading = ref(false);

const dialogVisible = ref(false)
const stores = ref([]);
const newStore = ref({
    name: '',
    location: '',
    description: '',
})

async function fetchStores() {
    loading.value = true;
    try {
        const response = await axios.get('http://localhost:3000/api/stores')
        stores.value = response.data.data
        loading.value = false;
        //console.log(stores.value)
    } catch (error) {
        console.log(error)
    }
}

async function addStore() {
    try {
        const response = await axios.post('http://localhost:3000/api/stores', newStore.value)
        console.log(response.data)
        stores.value.push(response.data.data)
        hideDialog()
    } catch (error) {
        console.log(error)
    }
}

const onRowEditSave = async (event) => {
    let { newData, index } = event;

    try {
        const response = await axios.put(`http://localhost:3000/api/stores/${newData._id}`, newData);

        if (response.status === 200) {
            stores.value[index] = newData;
        }
    } catch (error) {
        console.log(error);
    }
};


function showDialog() {
    dialogVisible.value = true
}

function hideDialog() {
    dialogVisible.value = false
}

fetchStores()
</script>
  
<style scoped>
.table-link {
    color: cadetblue;
    font-weight: 700;
    text-decoration: none;
}

/* Add your styles here */
</style>
  