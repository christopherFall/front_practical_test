<template>
  <v-card class="pa-4 elevation-2 rounded-xl">
    <v-card-title class="text-h6 font-weight-bold">
      Lista de Especialistas
    </v-card-title>

    <!-- Búsqueda Global -->
    <v-text-field
      v-model="search"
      class="ma-4"
      density="compact"
      variant="outlined"
      placeholder="Buscar por nombre o licencia profesional"
      prepend-inner-icon="mdi-magnify"
      hide-details
      color="primary"
    />

    <!-- Tabla -->
    <v-data-table
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="filteredItems"
      class="elevation-1 rounded-lg"
      hover
    >
      <!-- Filtros por columna -->
      <template #top>
        <v-row class="px-4 pb-2">
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="filters.firstName"
              label="Filtrar por nombre"
              clearable
              density="compact"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="filters.lastName"
              label="Filtrar por apellido"
              clearable
              density="compact"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="filters.professionalLicenseNumber"
              label="Filtrar por licencia"
              clearable
              density="compact"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="filters.specialty"
              label="Filtrar por especialidad"
              clearable
              density="compact"
            />
          </v-col>
        </v-row>
      </template>

      <!-- Horario agrupado -->
      <template #item.schedule="{ item }">
        <div v-if="item.availabilities">
          <div
            v-for="(group, day) in groupByDay(item.availabilities)"
            :key="day"
          >
            <strong>{{ day }}:</strong>
            {{ group.map(a => `${a.startTime} - ${a.endTime}`).join(', ') }}
          </div>
        </div>
      </template>
      <template #item.state="{ item }">
        <v-chip
          :color="item.state ? 'green' : 'red'"
          text-color="white"
          small
          class="font-weight-bold"
          >
          {{ item.state ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SpecialistService from '@/services/SpecialistService'

// Estados
const sortBy = ref([{ key: 'firstName', order: 'asc' }])
const serverItems = ref<any[]>([])
const search = ref('')
const filters = ref({
  firstName: '',
  lastName: '',
  professionalLicenseNumber: '',
  specialty: '',
})
const headers = [
  { title: 'Nombre', key: 'firstName', sortable: true },
  { title: 'Apellido', key: 'lastName', sortable: true },
  { title: 'Licencia Profesional', key: 'professionalLicenseNumber', sortable: true },
  { title: 'Especialidad', key: 'specialty.name', sortable: true },
  { title: 'Horario', key: 'schedule', sortable: false },
  { title: 'Estado', key: 'state', sortable: true },
]

// Carga inicial
loadItems()
async function loadItems() {
  try {
    const { data } = await SpecialistService.getAll()
    serverItems.value = data
  } catch (error) {
    console.error('Error al cargar especialistas:', error)
  }
}

// Filtro global + columnas
const filteredItems = computed(() => {
  return serverItems.value.filter((item) => {
    const fullText = `${item.firstName} ${item.lastName} ${item.professionalLicenseNumber}`.toLowerCase()
    const matchesSearch = fullText.includes(search.value.toLowerCase())

    const matchColumns =
      (!filters.value.firstName || item.firstName.toLowerCase().includes(filters.value.firstName.toLowerCase())) &&
      (!filters.value.lastName || item.lastName.toLowerCase().includes(filters.value.lastName.toLowerCase())) &&
      (!filters.value.professionalLicenseNumber || item.professionalLicenseNumber.toLowerCase().includes(filters.value.professionalLicenseNumber.toLowerCase())) &&
      (!filters.value.specialty || item.specialty?.name?.toLowerCase().includes(filters.value.specialty.toLowerCase()))

    return matchesSearch && matchColumns
  })
})

// Agrupar horarios
function groupByDay(availabilities: any[] = []) {
  return availabilities.reduce((grouped: Record<string, any[]>, current) => {
    if (!grouped[current.day]) grouped[current.day] = []
    grouped[current.day].push(current)
    return grouped
  }, {})
}
</script>
