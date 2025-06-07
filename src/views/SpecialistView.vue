<template>
  <div class="pa-4">
    <!-- Tabla paginada con búsqueda -->
<v-data-table-server
  v-model:items-per-page="itemsPerPage"
  :headers="headers"
  :items="serverItems"
  :items-length="totalItems"
  :loading="loading"
  item-value="id"
  @update:options="loadItems"
>

  <template #item.firstName="{ item }">
    {{ item.firstName }}
  </template>

  <template #item.lastName="{ item }">
    {{ item.lastName }}
  </template>

  <template #item.professionalLicenseNumber="{ item }">
    {{ item.professionalLicenseNumber }}
  </template>

  <template #item.specialty="{ item }">
    {{ item.specialty?.name || '-' }}
  </template>

  <!-- Mostrar horarios agrupados por día -->
  <template #item.schedule="{ item }">
    <div v-if="item.availabilities">
      <div v-for="(group, day) in groupByDay(item.availabilities)" :key="day">
        <strong>{{ day }}:</strong>
        {{ group.map(a => `${a.start_time} - ${a.end_time}`).join(', ') }}
      </div>
    </div>
  </template>
</v-data-table-server>


    <v-text-field
      v-model="search"
      class="ma-2"
      density="compact"
      placeholder="Buscar por nombre o cédula profesional"
      hide-details
      color="purple"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SpecialistService from '@/services/SpecialistService'

const itemsPerPage = ref(5)
const serverItems = ref([])
const totalItems = ref(0)
const loading = ref(false)
const search = ref('')
const lastOptions = ref({ page: 1, itemsPerPage: 5, sortBy: [] })

const headers = [
  { title: 'Nombre', key: 'firstName', sortable: true },
  { title: 'Apellido', key: 'lastName', sortable: true },
  { title: 'Licencia Profesional', key: 'professionalLicenseNumber', sortable: true },
  { title: 'Especialidad', key: 'specialty', sortable: true },
  { title: 'Horario', key: 'schedule', sortable: false },
]

async function loadItems(options: any) {
  loading.value = true
  lastOptions.value = options
  try {
    const { data, total } = await SpecialistService.getAll({
      page: options.page,
      limit: options.itemsPerPage,
      search: search.value
    })
    serverItems.value = data
    totalItems.value = total
  } catch (error) {
    console.error('Error al cargar especialistas:', error)
  } finally {
    loading.value = false
  }
}

watch(search, () => {
  loadItems({ ...lastOptions.value, page: 1 })
})
</script>

<script lang="ts">
export function groupByDay(availabilities: any[] = []) {
  return availabilities.reduce((acc: Record<string, any[]>, item) => {
    if (!acc[item.day]) acc[item.day] = []
    acc[item.day].push(item)
    return acc
  }, {})
}
</script>
