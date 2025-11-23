<template>
    <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 class="text-xl font-semibold border-b pb-2 mb-4">
                {{ modalMode === 'create' ? 'Tambah Data Baru' : 'Edit Data' }}
            </h3>

            <form @submit.prevent="submitForm">
                <div class="mb-3">
                    <label class="block text-gray-700 text-sm mb-1">Inventaris ID</label>
                    <input v-model="form.inventaris_id" type="text" required
                        class="w-full border p-2 rounded focus:ring-indigo-500 focus:border-indigo-500" />
                </div>

                <div class="mb-3">
                    <label class="block text-gray-700 text-sm mb-1">Barang</label>
                    <input v-model="form.barang" type="text" required class="w-full border p-2 rounded" />
                </div>

                <div class="mb-3">
                    <label class="block text-gray-700 text-sm mb-1">Type</label>
                    <input v-model="form.type" type="text" required class="w-full border p-2 rounded" />
                </div>

                <div class="mb-3">
                    <label class="block text-gray-700 text-sm mb-1">Serial Number</label>
                    <input v-model="form.serial_number" type="text" required class="w-full border p-2 rounded" />
                </div>

                <div class="mb-3">
                    <label class="block text-gray-700 text-sm mb-1">Spesifikasi</label>
                    <input v-model="form.spesifikasi" type="text" required class="w-full border p-2 rounded" />
                </div>

                <div class="mb-3">
                    <label class="block text-gray-700 text-sm mb-1">Status</label>
                    <select v-model="form.status" required class="w-full border p-2 rounded">
                        <option>Baik</option>
                        <option>Rusak</option>
                        <option>Tidak Dipakai</option>
                        <option>Dilelang</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="block text-gray-700 text-sm mb-1">Assign</label>
                    <select v-model.number="form.assign" class="w-full border p-2 rounded-lg focus:ring-indigo-500">
                        <option :value="null">-- Pilih Anggota --</option>

                        <option v-for="member in props.members" :key="member.id" :value="member.id">
                            {{ member.name }}
                        </option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="block text-gray-700 text-sm mb-1">Department</label>
                    <select v-model="form.department" required
                        class="w-full border p-2 rounded-lg focus:ring-indigo-500">
                        <option v-for="dept in props.departments" :key="dept" :value="dept">
                            {{ dept }}
                        </option>
                    </select>
                </div>

                <div class="flex justify-end space-x-3 mt-5">
                    <button type="button" @click="$emit('close')"
                        class="bg-gray-200 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-300">
                        Cancel
                    </button>
                    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modalMode: String, // 'create' atau 'edit'
    inventoryData: { type: Object, default: () => ({}) },
    members: { type: Array, default: () => [] },
    isVisible: Boolean,
    mode: String, // 'create' atau 'edit'
    departments: Array // ✅ Props baru: Daftar departemen
});

const emit = defineEmits(['close', 'save']);
const form = ref({});

// Watcher untuk mengisi formulir saat data inventaris berubah (mode edit)
watch(() => props.inventoryData, (newData) => {
    if (newData && Object.keys(newData).length > 0) {
        // ✅ PASTIKAN form.assign DIISI DENGAN ID, BUKAN OBJEK ANGGOTA
        form.value = {
            ...newData,
            // Jika ada objek 'anggota', ambil ID-nya untuk mengisi dropdown select
            assign: newData.anggota ? newData.anggota.id : newData.assign || null,
        };
    } else {
        // Mode Create
        form.value = { assign: null, };

    }
}, { immediate: true, deep: true });

const submitForm = () => {
    const payload = { ...form.value };

    // Jika Assign memiliki nilai (bukan null), pastikan itu diubah menjadi integer
    if (payload.assign && typeof payload.assign !== 'number') {
        payload.assign = parseInt(payload.assign);
    }

    if (props.modalMode === 'create') {
        // Asumsi backend ingin 'user_id' untuk CREATE, tapi 'assign' untuk UPDATE
        payload.user_id = payload.assign; 
        delete payload.assign; // Hapus field lama
    }
    
    emit('save', payload);
};

</script>